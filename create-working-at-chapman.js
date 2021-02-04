// SERVER SIDE JAVASCRIPT FOR DATA RETRIEVAL FOR MORE INFO SEE
// https://developer.salesforce.com/docs/atlas.en-us.mc-programmatic-content.meta/mc-programmatic-content/ssjs_serverSideJavaScript.htm

// PLATFORM PROVIDES A LIBRARY OF JAVASCRIPT FUNCTIONS TO INTERACT WITH MARKETING CLOUD BUT HAS TO BE LOADED FIRST
// https://developer.salesforce.com/docs/atlas.en-us.mc-programmatic-content.meta/mc-programmatic-content/ssjs_platformFunctions.htm
Platform.Load("core", "1.1.2");
var proxy = null;
try {
  // WHEN CALLING THIS IN THE PREVIEW WINDOW CAUSES ERROR SO WRAPPED IN TRY CATCH BLOCK
  // WSPROXY IS THE PREFERRED METHOD SALESFORCE RECOMMENDS FOR INTERACTING WITH SALESFORCE MARKETING CLOUD SOAP API
  // https://developer.salesforce.com/docs/atlas.en-us.mc-programmatic-content.meta/mc-programmatic-content/ssjs_WSProxy_useSSJS.htm
  proxy = new Script.Util.WSProxy();
} catch (err) {
  Write("Error Retriving WSProxy <br>")
  // METHODS LIKE WRITE AND STRINGIFY ARE PROVIDED BY THE PLATFORM JAVASCRIPT LIBRARY PROVIDED BY SALESFORCE
  // USE STRNGIFY TO PRINT OBJECS RETURNED FROM SALESFORCE MARKETING CLOUD
  // https://developer.salesforce.com/docs/atlas.en-us.mc-programmatic-content.meta/mc-programmatic-content/ssjs_platformClientBrowserWrite.htm?search_text=Write
  // https://developer.salesforce.com/docs/atlas.en-us.mc-programmatic-content.meta/mc-programmatic-content/ssjs_utilitiesStringify.htm?search_text=Stringify
  Write(Stringify(err))
}

if (proxy) {
  var requestType = Request.Method;
  var urlThis = Platform.Request.RequestURL;
  var contentHTML = '';

  if (requestType == 'POST') {
    // USE THE REQUEST OBJECT FROM PLATFORM LIBRARY TO GET FORM DATA SUBMITTED ON POST REQUEST
    // https://developer.salesforce.com/docs/atlas.en-us.mc-programmatic-content.meta/mc-programmatic-content/ssjs_platformHTTPPropertyGetFormField.htm?search_text=Stringify
    var mondaysSelectedDate = Request.GetFormField('mondays-date')
    var wednesdaysSelectedDate = Request.GetFormField('wednesdays-date');

    if (mondaysSelectedDate != null && wednesdaysSelectedDate != null) {
      // CUSTOMER KEY FROM THE DATA EXTENSION WHICH CAN BE FOUND IN SFMC IN THE DATA EXTENSIONS PROPERTIES
      var customerKey = "19ED2973-3D94-4D9D-806B-7E8FAEF10E5E";
      var cols = ["type", "content", "email-title", "link", "time", "location", "position"];
      // THE FILTER OBJECT HERE IS USED TO QUERY FOR SPECIFIC DATA IN THE SOAP REQUESTS
      // THIS FILTER IS FINDING THE DATA EXTENSIONS ROWS WITH THE SPECIFIED EQUIVALENT DATE
      // NEEDS TO BE UPDATED TO DYNAMIC BY READING THE DATE FROM THE FORM FIELD SUBMITTED
      // https://developer.salesforce.com/docs/atlas.en-us.mc-programmatic-content.meta/mc-programmatic-content/ssjs_WSProxy_basic_retrieve.htm?search_text=Stringify
      var filter = {
        Property: "monday-date",
        SimpleOperator: "equals",
        Value: "01/25/21"
      };
      var facultyStafffAnnouncements = '';
      var featuredStores = '';
      var chapmanInTheNews = '';
      var events = '';

      try {
        // PERFORMS THE ACTUAL RETREIVAL FROM SFMC 
        // https://developer.salesforce.com/docs/atlas.en-us.mc-programmatic-content.meta/mc-programmatic-content/ssjs_WSProxy_basic_retrieve.htm?search_text=Stringify
        var data = proxy.retrieve("DataExtensionObject[" + customerKey + "]", cols, filter);

        for (var i = 0; i < data.Results.length; i++) {
          var currentSection = '';
          var currentContent = '';
          var currentLink = '';
          var currentEmailTitle = '';

          for (var j = 0; j < data.Results[i].Properties.length; j++) {
            var currentName = data.Results[i].Properties[j].Name;
            var currentValue = data.Results[i].Properties[j].Value;

            switch (currentName) {
              case 'content':
                if (currentValue != '') {
                  currentContent = '<div class="item-content">' + currentValue + '</div>';
                }
                break;
              case 'type':
                currentSection = currentValue;
                break;
              case 'email-title':
                currentEmailTitle = currentValue;
                break;
              case 'link':
                currentLink = '<a class="item-link" href="' + currentValue + '">' + currentEmailTitle + '</a>';
                break;
              default:
                break;
            }
          }

          switch (currentSection) {
            case 'event':
              events = events + '<div class="event-item">' + currentLink + currentContent + '</div>';
              break;
            case 'announcement':
              facultyStafffAnnouncements = facultyStafffAnnouncements + '<div class="event-item">' + currentLink + currentContent + '</div>';
            case 'in-the-news':
              chapmanInTheNews = chapmanInTheNews + '<div class="in-the-news-item">' + currentLink + currentContent + '</div>';
              break;
            case 'featured':
              featuredStores = featuredStores + '<div class="featured-stories-item">' + currentLink + currentContent + '</div>';
            default:
              break;
          }
        }
        events = '<div class="events">' + events + '</div>';
        facultyStafffAnnouncements = '<div class="announcements">' + facultyStafffAnnouncements + '</div>';
        chapmanInTheNews = '<div class="in-the-news">' + chapmanInTheNews + '</div>';
        featuredStores = '<div class="featured-stories">' + featuredStores + '</div>';

        contentHTML = '<div class="email-content">' + facultyStafffAnnouncements + chapmanInTheNews + featuredStores + events + '</div>';

        ////////// BEGIN REST API \\\\\\\\\\\\\

        //////// BEGIN AUTH TOKEN RETRIEVAL \\\\\\\\\\
        // TO PERFORM CRUD OPS AN AUTH TOKEN WITH THE APPROPRIATE HEADERS MUST BE PLACED AND THE REST API ENDPOINT PROVIDED IN A SERVER TO SERVER API INTEGRATION
        var contentType = 'text/xml';
        var appType = 'application/json';
        var authUrl = 'https://mc9-x13m9sbbt19l3fr2xbvxm8l1.auth.marketingcloudapis.com/v2/token';
        var headername = [];
        var headervalues = [];
        var access_token = "";
        var data = {
          grant_type: 'client_credentials',
          client_id: 'b2l6zncru8ik4amw7cage3ux',
          client_secret: 'hKQJI1KlUlzDD6BImFNhukKr',
          account_id: 514000427
        };

        try {
          // AN POST REQUEST TO THE API END POINT FOR AN AUTH TOKEN
          var req = HTTP.Post(authUrl, appType, Stringify(data));
          var token = Platform.Function.ParseJSON(req.Response[0]);
          access_token = token.access_token;
        } catch (err) {
          Write("<br> IM THE REST AUTH ERROR")
          Write(Stringify(err))
        }
        //////// END AUTH TOKEN RETRIEVAL \\\\\\\\\\

        /////// BEGIN ASSET RETRIEVE \\\\\\\\\
        // THE TOKEN RETREIVAL IS NECESSARY TO ACCEESS CONTENT BUILDER FOR EMAIL CREATION WHICH IS PROVIDED BELOW IN THE HEADER VALUE FOR AUTHORIZATION WITH THE BEARER 
        try {
          var restCreateEmailUrl = "https://mc9-x13m9sbbt19l3fr2xbvxm8l1.rest.marketingcloudapis.com/asset/v1/content/assets";
          var authHeaderName = ['Authorization'];
          var authHeaderValues = ['Bearer ' + access_token];
          var appType = 'application/json';
          var content = '<div>' + contentHTML + '</div>';
          var date = mondaysSelectedDate || wednesdaysSelectedDate;
          var subjLine = 'Working At Chapman';
          var assetObj = {
            "name": 'Working at Chapman-' + date,
            "channels": {
              "email": true,
              "web": false
            },
            "views": {
              "html": {
                "content": content
              },
              "text": {
                "content": "MY EMAIL"
              },
              "subjectline": {
                "content": subjLine
              },
              "preheader": {}
            },
            "assetType": {
              "name": "htmlemail",
              "id": 208
            },
            "category": {
              "id": 18961
            }
          };
          var emailCreated = HTTP.Post(restCreateEmailUrl, appType, Stringify(assetObj), authHeaderName, authHeaderValues);
        } catch (err) {
          Write("<br> IM THE EMAIL CREATED ERROR: ")
          Write(Stringify(err))
        }
        /////// END ASSET RETRIEVE \\\\\\\\\


        /////// BEGIN ASSET CREATE \\\\\\\\\
        try {
          var restCreateEmailUrl = "https://mc9-x13m9sbbt19l3fr2xbvxm8l1.rest.marketingcloudapis.com/asset/v1/content/assets";
          var authHeaderName = ['Authorization'];
          var authHeaderValues = ['Bearer ' + access_token];
        } catch (err) {
          Write(Stringify(err))
        }

      } catch (err) {
        Write("<br> IM THE JS BODY ERROR")
        Write(Stringify(err))
      }
    }
  }
}