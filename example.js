// Collegamento API SAP con Javascript

// # Esempio di connessione
// Obbligatori:
// base
// credentials

let config = {
  base: process.env.SAP_BASE_URL,
  credentials: {
      CompanyDB: process.env.SAP_COMPANY_DB,
      UserName: process.env.SAP_USER,
      Password: process.env.SAP_PASSWORD,
  }
};

var sap = await Sap.connect(config);

// Con questi parametri del config verrá effettuato un login
// vengono settati i seguenti attributi

sap.timestampStartSession
// 1655796768191

sap.timestampExpireSession
//1655839968191

sap.loginData
// {
//    "Version": "1000170",
//    "SessionId": "58f6e39a-f134-11ec-8000-005056a0e477",
//    "SessionTimeout": 720,
//    "odata.metadata": "https://meditsl.gendata.it:50000/b1s/v1/$metadata#B1Sessions/@Element"
//  }

// Salvando questi attributi da qualche parte
// possiamo recuperarli in seguito per efettuare chiamate rest a sap senza Login

config = {
  base: '',
  credentials : {...}
  loginData: {
    SessionId: "58f6e39a-f134-11ec-8000-005056a0e477",
  },
  timestampStartSession: 1655796768191,
  timestampExpireSession: 1655839968191
}

sap = await Sap.connect(config);

await sap.get('BusinessPartners');

// Sap ritorna le collezioni con un oggetto a due chiavi all'interno della chiave value
sap.responseData
// { odata.metadata: '...', value: [..] } array: collezione di oggetti

sap.getResponse()
// ritorna il tutto valore della risposta sap intressato:
// se collezione: sap.responseData.value, ritornando un array di oggetti
// se single type: sap.responseData, ritornando un oggetto

sap.response()
// ritorna in modo intelligente il valore della chiamata rest (che sia un acollezione o una single type)
// utilizza il metodo getResponse()

// Sap ritorna i singoli record direttamente con l'oggetto contenente tutti gli attributi dell'entitá
await sap.get(`BusinessPartners('CA0B01)`);

// { CardCode: 'CA0B01', CardType: 'cLid', ... }

sap.response()

// Se vuoi puoi acccedere direttamente ai valori dell'oggetto response passando il percorso del campo
sap.response('CardCode')
sap.response('BPPaymentMethods.0.PaymentMethodCode')
sap.response('BPIntrastatExtension.TransportMode')

// # Filtri e selezioni campi
let select = [
  'CardName',
  'CardCode',
  'CardType',
  'BPAddresses',
  'AdditionalID',
  'FederalTaxID',
  'Phone1',
  'EmailAddress',
  'SalesPersonCode',
  'PayTermsGrpCode',
  'U_MCR_SCA',
];

let update = {
  date: '2022-07-31',
  time: '12:00::00'
}

await sap.get('BusinessPartners', {
  $select: select.join(','),
  $filter: `UpdateDate ge '${update.date}' and UpdateTime ge '${update.time}'`
});
