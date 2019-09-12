const PagSeguro = require('@luismramirezr/pagseguro');
const Mailchimp = require('mailchimp-api-v3');
const md5 = require('md5');
const SES = require('aws-sdk/clients/ses');

const ses = new SES({ region: 'us-east-1' });

const { EMAIL, TOKEN, LISTID, SANDBOX, SANDBOX_EMAIL, MAILCHIMP, NOTIFICATIONEMAIL } = process.env;

const mailchimp = new Mailchimp(MAILCHIMP);

const PagSeguroConfig = {
  email: EMAIL,
  token: TOKEN,
  sandbox: SANDBOX === 'false' ? false : true || false,
  sandboxEmail: SANDBOX_EMAIL || null,
};

const transactionCodes = {
  1: 'Aguardando Pagamento',
  2: 'Em análise',
  3: 'Paga',
  4: 'Disponível',
  5: 'Em disputa',
  6: 'Devolvuda',
  7: 'Cancelada',
};

async function updateEmail(emailHash, mailchimpData) {
  const result = await mailchimp
    .put(`/lists/${LISTID}/members/${emailHash}`, mailchimpData)
    .then(async response => {
      const { tags } = response;
      const tagsToAdd = mailchimpData.tags.filter(tag => {
        return !tags.includes(tag);
      });
      if (tagsToAdd.length > 0) {
        await mailchimp
          .post(`/lists/${LISTID}/members/${emailHash}/tags`, {
            tags: tagsToAdd.map(tag => {
              return {
                name: tag,
                status: 'active',
              };
            }),
          })
          .then(() => {
            return { status: true };
          })
          .catch(err => {
            console.dir(err);
            return { status: false, err };
          });
      }
      return { status: true };
    })
    .catch(err => {
      console.dir(err);
      return { status: false, err };
    });
  return result;
}

module.exports = {
  async subscribe(req, res) {
    const { body } = req;
    const { email } = body;

    const emailHash = md5(email.toLowerCase());

    const mailchimpData = {
      email_address: email,
      status: 'subscribed',
      tags: ['ws_visitou'],
    };

    await mailchimp
      .put(`/lists/${LISTID}/members/${emailHash}`, mailchimpData)
      .then(async response => {
        const { tags } = response;
        const tagsToAdd = mailchimpData.tags.filter(tag => {
          return !tags.includes(tag);
        });
        if (tagsToAdd.length > 0) {
          await mailchimp
            .post(`/lists/${LISTID}/members/${emailHash}/tags`, {
              tags: tagsToAdd.map(tag => {
                return {
                  name: tag,
                  status: 'active',
                };
              }),
            })
            .catch(err => {
              console.log(err);
            });
        }
      })
      .catch(err => {
        console.log(err);
      });
    res.json({ ok: true });
  },

  async getSession(req, res) {
    try {
      const Payment = new PagSeguro(PagSeguroConfig);
      const response = await Payment.getSession();
      console.dir(response);
      if (response.status) {
        const { id } = response.response.session;
        res.json({ status: true, id });
        return;
      }
      throw new Error(response);
    } catch (error) {
      res.json({ status: false, error });
    }
  },

  async transaction(req, res) {
    const { body } = req;

    const { hash, ccToken, data } = body;

    const emailHash = md5(data.email.toLowerCase());

    const wsChoise = data.cart.find(product => {
      return ['GYN', 'BSB'].includes(product.id);
    });

    const mailchimpData = {
      email_address: data.email.toLowerCase(),
      status: 'subscribed',
      tags: ['ws_visitou', 'ws_inscrito', `ws_${wsChoise.id}_inscrito`],
      merge_fields: {
        NOME_COMP: data.nome,
        NOME_PRIM: data.nome.split(' ')[0],
        CPF: data.cpf,
        TELEFONE: data.phone,
        DOB: data.dob,
        END_RUA: data.street,
        END_NUMERO: data.number,
        END_COMP: data.complement,
        END_BAIRRO: data.neigh,
        END_CIDADE: data.city,
        END_ESTADO: data.district,
        END_CEP: data.zip,
      },
    };

    const emailData = {
      WORKSHOP: wsChoise.id,
      NOME: data.nome,
      CPF: data.cpf,
      EMAIL: data.email.toLowerCase(),
      TELEFONE: data.phone,
      ANIVERSARIO: data.dob,
      RUA: data.street,
      COMPLEMENTO: data.complement,
      NUMERO: data.number,
      BAIRRO: data.neigh,
      CIDADE: data.city,
      ESTADO: data.district,
      CEP: data.zip,
      PAGAMENTO: 'Transferência/Depósito',
      STATUS: 'Aguardando',
      CODIGO: '',
      PREVIEWTEXT: `Nova Inscrição Workshop ${wsChoise.id}`,
    };

    if (data.paymentMethod === 'debt') {
      mailchimpData.tags.push('ws_pag_offline', `ws_${wsChoise.id}_pag_offline`);

      const result = await updateEmail(emailHash, mailchimpData);
      console.dir(result);
      if (result.status) {
        const email = {
          Destination: {
            ToAddresses: [NOTIFICATIONEMAIL],
          },
          Source: NOTIFICATIONEMAIL,
          Template: 'Admin-Inscricao-Workshop-v1-0-0',
          TemplateData: JSON.stringify(emailData),
          ConfigurationSetName: 'MorgentalMTC',
        };

        const response = await ses.sendTemplatedEmail(email).promise();
        res.json({ status: 'debt' });
        console.dir(response);
        return;
      }
      res.json({ status: 0, err: result.status.err });
      return;
    }

    const Payment = new PagSeguro(PagSeguroConfig);

    const phone = String(data.phone).replace(/\D/g, '');
    const ccPhone = String(data.cc_phone).replace(/\D/g, '');

    const sender = {
      senderHash: hash,
      senderName: data.nome,
      senderEmail: data.email,
      senderCPF: String(data.cpf).replace(/\D/g, ''),
      senderAreaCode: phone.substr(0, 2),
      senderPhone: phone.substr(2),
    };

    const shipping = {
      shippingAddressRequired: false,
    };

    const items = data.cart.map(product => {
      const { id, name, desc, value } = product;
      return {
        id,
        quantity: 1,
        amount: Number(value),
        description: `${name} - ${desc}`,
      };
    });

    const holder = {
      creditCardHolderName: data.cc_nome,
      creditCardHolderCPF: String(data.cc_cpf).replace(/\D/g, ''),
      creditCardHolderBirthDate: data.cc_dob,
      creditCardHolderAreaCode: ccPhone.substr(0, 2),
      creditCardHolderPhone: ccPhone.substr(2),
    };

    const installments = {
      installmentQuantity: 1,
      installmentValue: data.installmentValue,
      noInterestInstallmentQuantity: 12,
    };

    const billing = {
      sameAsShipping: false,
      billingAddressStreet: data.cc_street,
      billingAddressNumber: data.cc_number,
      billingAddressComplement: data.cc_complement,
      billingAddressDistrict: data.cc_neigh,
      billingAddressPostalCode: String(data.cc_zip).replace(/\D/g, ''),
      billingAddressCity: data.cc_city,
      billingAddressState: data.cc_district,
    };

    Payment.setCheckoutData(sender, shipping, items, {
      method: 'creditCard',
      params: [ccToken, holder, billing, installments],
    });

    const result = await Payment.makePayment({
      reference: 'Workshop',
      extraAmount: 5,
    });

    if (!result.status) {
      res.json({ result: false, error: result });
    }

    const { status, code } = result.response.transaction;
    if (status !== 7) {
      emailData.PAGAMENTO = 'Cartão de Crédito';
      emailData.STATUS = transactionCodes[status];
      emailData.CODIGO = code;

      if (status === 3) {
        mailchimpData.tags.push('ws_pag_efetuado', `ws_${wsChoise.id}_pag_efetuado`);
      } else {
        mailchimpData.tags.push('ws_pag_pendente', `ws_${wsChoise.id}_pag_pendente`);
      }

      const email = {
        Destination: {
          ToAddresses: [NOTIFICATIONEMAIL],
        },
        Source: NOTIFICATIONEMAIL,
        Template: 'Admin-Inscricao-Workshop-v1-0-0',
        TemplateData: JSON.stringify(emailData),
        ConfigurationSetName: 'MorgentalMTC',
      };

      const mailchimpEmail = await updateEmail(emailHash, mailchimpData);
      const response = await ses.sendTemplatedEmail(email).promise();
      console.log(mailchimpEmail);
      console.log(response);
    }
    res.json({ result: true, status, response: result });
  },
};
