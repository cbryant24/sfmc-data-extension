Platform.Load("core", "1.1.2");
var proxy = new Script.Util.WSProxy();
var requestType = Request.Method;
var urlThis = Platform.Request.RequestURL;
var customerKey = "19ED2973-3D94-4D9D-806B-7E8FAEF10E5E";
var section = '';
var content = '';
var emailTitle = '';
var link = '';
var time = '';
var location = '';
var position = '';
var mondaysDate = '';
var wednesdayDate = '';
var name = '';
var email = '';
var comments = '';
var dataExtensionId = '';
var type = '';

if (requestType == "GET") {
  // Request.GetFormField("data-extension-id");

  dataExtensionId = Request.GetQueryStringParameter('data-extension-id');
  //dataExtensionId = '02/01/21-02/10/21-1611732337907';
  Write("<br>IM THE DATA EXTENDION ID!!: ");
  Write(Stringify(dataExtensionId));
  if (dataExtensionId != null && dataExtensionId != '') {
    // THIS ORDER OF COLUMNS IS IMPORTANT SEE SWITCH STATEMENT BELOW
    var cols = ["type", "section", "content", "email-title", "link", "time", "location", "position", "monday-date", "wednesday-date", "name", "email", "comments"];
    var filter = {
      Property: "id",
      SimpleOperator: "equals",
      Value: dataExtensionId
    };
    try {
      // TO RETRIEVE A SPECIFIC DATA EXTENSION ROW YOU NEED TO PROVIDE THAT CUSTOMER KEY WHICH IS THE EXTENAL KEY AND IN THIS CASE IS THE PRIMARY KEY FOR THAT DATA EXTENSION
      var data = proxy.retrieve("DataExtensionObject[" + customerKey + "]", cols, filter);
      var result = data.Results[0];
      for (var i = 0; i < result.Properties.length; i++) {
        // ORDER OF PROPERTIES IS IMPORTANT AS THERE ARE DEPENDENTS THAT NEED TO BE PROCESSED FIRST
        switch (result.Properties[i].Name) {
          case 'content':
            content = result.Properties[i].Value;
            Variable.SetValue('content', content);
            break;
          case 'section':
            section = result.Properties[i].Value;
            break;
          case 'email-title':
            emailTitle = result.Properties[i].Value
            Variable.SetValue('emailTitle', emailTitle);
            break;
          case 'link':
            link = result.Properties[i].Value;
            break;
          case 'time':
            time = result.Properties[i].Value;
            break;
          case 'location':
            location = result.Properties[i].Value;
            Variable.SetValue('location', location);
            break;
          case 'position':
            position = result.Properties[i].Value;
            break;
          case 'monday-date':
            mondaysDate = result.Properties[i].Value;
            break;
          case 'wednesday-date':
            wednesdayDate = result.Properties[i].Value;
            break;
          case 'email':
            email = result.Properties[i].Value;
            break;
          case 'name':
            name = result.Properties[i].Value;
            Variable.SetValue('name', name);
            break;
          case 'comments':
            comments = result.Properties[i].Value;
            Variable.SetValue('comments', comments);
            break;
          case 'type':
            type = result.Properties[i].Value;
            break;
          default:
            break;
        }
      }
    } catch (err) {
      Write("<br>IM THE RETRIEVE ERROR")
      Write(Stringify(err))
    }
  }
}

if (requestType == "POST") {
  dataExtensionId = Request.GetQueryStringParameter('data-extension-id');

  if (dataExtensionId != null && dataExtensionId != '') {
    type = Request.GetFormField("event-announcement");
    time = Request.GetFormField("time");
    location = Request.GetFormField("location");
    startDate = Request.GetFormField("start-date");
    endDate = Request.GetFormField("end-date");
    content = Request.GetFormField("content");
    emailTitle = Request.GetFormField("email-title");
    mondayDate = Request.GetFormField("monday-date");
    wednesdayDate = Request.GetFormField("wednesday-date");
    link = Request.GetFormField("link");
    name = Request.GetFormField("name");
    email = Request.GetFormField("email");
    eventChecked = Request.GetFormField("event") ? "checked" : "";
    announcementChecked = Request.GetFormField("announcement") ? "checked" : "";
    comments = Request.GetFormField("comments") + " ";

    Variable.SetValue('content', content);
    Variable.SetValue('emailTitle', emailTitle);
    Variable.SetValue('location', location);
    Variable.SetValue('comments', comments);

    var updateObject = {
      CustomerKey: customerKey,
      Keys: [{
        Name: "id",
        Value: dataExtensionId
      }],
      Properties: [{
          "Name": "type",
          "Value": type
        },
        {
          "Name": "time",
          "Value": time
        },
        {
          "Name": "location",
          "Value": location
        },
        {
          "Name": "position",
          "Value": 0
        },
        {
          "Name": "content",
          "Value": content
        },
        {
          "Name": "email-title",
          "Value": emailTitle
        },
        {
          "Name": "monday-date",
          "Value": mondayDate
        },
        {
          "Name": "wednesday-date",
          "Value": wednesdayDate
        },
        {
          "Name": "name",
          "Value": name
        },
        {
          "Name": "link",
          "Value": link
        },
        {
          "Name": "email",
          "Value": email
        },
        {
          "Name": "comments",
          "Value": comments
        },
      ]
    }

    var options = {
      SaveOptions: [{
        PropertyName: '*',
        SaveAction: 'UpdateAdd'
      }]
    };

    try {
      var updatedItem = proxy.updateItem("DataExtensionObject", updateObject, options);
    } catch (err) {
      Write("<br>IM THE UPDATE ERR")
      Write(Stringify(err))
    }
  }
}