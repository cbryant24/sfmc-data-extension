Platform.Load("core", "1.1.2");
var proxy = new Script.Util.WSProxy();

var urlThis = Platform.Request.RequestURL;
var requestType = Request.Method;
var externalKey = "All Subscribers - 265";
var subscriberKey = Variable.GetValue("@subscriberKey") || 'cbryant@chapman.edu.514000427';
var cols = ["ID", "PartnerKey", "Client.ID", "Client.PartnerClientKey", "EmailAddress", "SubscriberKey", "Status", "EmailTypePreference", "SubscriberList"];
var filter = {
  Property: "SubscriberKey",
  SimpleOperator: "equals",
  Value: subscriberKey
};
var queryAllAccounts = false; // this is important otherwise you just get the parent BU
var deFields = null;
var firstName = '';
var lastName = '';
var email = '';
var unsubscribeFromAllStatus = true;
var emailPreference = "Text";

var subCols = ['ListName', 'ID'];
var subFilter = {
  Property: 'ID',
  SimpleOperator: 'equals',
  Value: 696
};
var publists = null;

try {
  //publists = proxy.retrieve('List', subCols, subFilter, queryAllAccounts);

  var newSub = {
    SubscriberKey: 'cbryant@chapman.edu.514000427',
    EmailAddress: 'cbryant@chapman.edu',
    Lists: [{
      ID: 602,
      Status: 'Unsubscribed'
    }]
  };

  var newOptions = {
    SaveOptions: [{
      PropertyName: '*',
      SaveAction: 'UpdateAdd'
    }]
  };

  //var resp = proxy.createItem('Subscriber', newSub, newOptions);
  //Write('<br>Response FOR SUB: ' + Stringify(resp));
  //Write('<br>IM PUB LIST: ');
  // Write(Stringify(publists));
} catch (err) {
  Write('<br>Im the error!!!: ');
  Write(Stringify(err));
}

if (requestType == "GET") {
  if (subscriberKey != "") {
    try {
      var data = proxy.retrieve("Subscriber", cols, filter, queryAllAccounts);
      Write("<br>IM RESULTS");
      Write(Stringify(data));
      email = data.Results[0].EmailAddress;
      firstName = data.Results[0].Attributes[0].Value;
      lastName = data.Results[0].Attributes[1].Value;
      emailPreference = data.Results[0].EmailTypePreference;
      unsubscribeFromAllStatus = data.Results[0].Status == "Unsubscribed" ? "checked" : "";
      emailPreference = data.Results[0].EmailTypePreference == "HTML" ? "checked" : "";
    } catch (err) {
      Write("<br>I Error'd");
      Write(Stringify(err));
    }
  }
} else if (requestType == "POST!!!") {
  //Write("<br> IM IN THE POST: ")
  //Write(unsubscribeFromAllStatus)

  var subscriberKey = Request.GetFormField("subscriberKey");
  var firstName = Request.GetFormField("firstName");
  var lastName = Request.GetFormField("lastName");
  var email = Request.GetFormField("email");
  var unsubscribeFromAllStatus = Request.GetFormField("unsubscribe") ? "Unsubscribed" : "Active";
  var htmlPreference = Request.GetFormField("preference") ? "HTML" : "Text";
  var resp = null;
  Write("<br>IM THE VALS UNSUB")
  Write(Request.GetFormField("unsubscribe"))
  Write("<br>IM THE VALS PREF")
  Write(Request.GetFormField("preference"))
  if (subscriberKey) {
    var sub = {
      SubscriberKey: subscriberKey,
      EmailAddress: email,
      Status: unsubscribeFromAllStatus,
      EmailTypePreference: htmlPreference,
      Attributes: [{
          Name: "First Name",
          Value: firstName
        },
        {
          Name: "Last Name",
          Value: lastName
        },
        {
          Name: "Email Address",
          Value: email
        }
      ]
    };
    var options = {
      SaveOptions: [{
        PropertyName: "*",
        SaveAction: "UpdateAdd"
      }]
    };

    try {
      resp = proxy.updateItem("Subscriber", sub, options);
    } catch (err) {
      Write("<br>Im the error!!!: ")
      Write(Stringify(err))
    }


    Write("<br>Response!: " + Stringify(resp));
  }

}
var subListCols = ["ID"];
var subListfilter = {
  Property: "ID",
  SimpleOperator: "equals",
  Value: 707
};
var newData = null;
try {
  newData = proxy.retrieve("ListSubscriber", subListCols, subListfilter, true);
} catch (err) {
  Write("<br>IM ERRd")
  Write(err)
}
//Write("<br>IM SUBLIST RETRIEVE: ")
//Write(Stringify(newData));
//var val = describeGeneric("AccountUser ");
//Write("<br> IM THE DESCRIBE: ")
//Write(Stringify(val));
var subInit = Subscriber.Init('cbryant@chapman.edu.514000427');
var subLists = subInit.Lists.Retrieve();
Write("<br>IM THE SSJS SUB: ")
Write(Stringify(subLists))
//retrieves the name of all retrievable fields inside obj
function describeGeneric(soapObjName) {
  //example soapObjName: "DataExtension"

  var req = proxy.describe(soapObjName);
  return req;
}