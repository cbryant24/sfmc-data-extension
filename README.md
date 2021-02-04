# Salesforce

## Data Extensions

You can create data extensions to store any persistent data including mailings lists with specific data. If you wanted to create a mailing list and also store
additional data i.e. `fields` outside of the subscribers list you would do so with a data extension. Data Extensions can also store data to be used for building content
like emails.

Data Extensions can't be edited in Salesforce unless exporting the list then make edits and then reimport. Alternative would be to build a form that can retrieve and update 
Data Extensions via an API call see [Salesforce Documentation on Server Side Javascript Data Extension Functions](https://developer.salesforce.com/docs/atlas.en-us.noversion.mc-programmatic-content.meta/mc-programmatic-content/ssjs_dataExtensionFunctions.htm)

### Notes

When documentation or code refers to `CustomerKey` this is a reference to the `External Key` and can be found in the Data Extension in the `Email > Subscribers` tab once there find the 
`Data Extensions` in the left hand menu. After selecting the appropriate Data Extension you can find the `External Key` under the `properties` tab for that Data Extension

### Retrievals

To perform retrievals on Data Extensions see the examples below with Server Side Javascript and the Data Extensions `working_at_chapman_list`

* Results will always return an array

```javascript
var cols = ["section", "content", "email-title", "link", "time", "location", "position", "monday-date", "wednesday-date"];
var customerKey = "19ED2973-3D94-4D9D-806B-7E8FAEF10E5E"
var filter = {
  Property: "id",
  SimpleOperator: "equals",
  Value: "02/01/21-02/10/21-1611732337907"
};
try {
  var data = proxy.retrieve("DataExtensionObject[" + customerKey + "]", cols, filter);
} catch(err) {
  Write("<br>IM THE RETRIEVE ERROR: ")
  Write(err)
}

// returned data obj
{
  "Status": "OK",
  "RequestID": "1b5551c5-6eed-41e0-9d45-5592dfef7c76",
  "Results": [{
    "Name": null,
    "Keys": null,
    "Type": "DataExtensionObject",
    "Properties": [{
      "Name": "section",
      "Value": "event"
    }, {
      "Name": "content",
      "Value": "Hello World"
    }, {
      "Name": "email-title",
      "Value": "Fourth Title To Use"
    }, {
      "Name": "link",
      "Value": "https://www.facebook.com"
    }, {
      "Name": "time",
      "Value": "11:00pm"
    }, {
      "Name": "location",
      "Value": "Chapman Plaza 3"
    }, {
      "Name": "position",
      "Value": "0"
    }, {
      "Name": "monday-date",
      "Value": "02/01/21"
    }, {
      "Name": "wednesday-date",
      "Value": "02/10/21"
    }],
    "Client": null,
    "PartnerKey": null,
    "PartnerProperties": null,
    "CreatedDate": "0001-01-01T00:00:00.000",
    "ModifiedDate": null,
    "ID": 0,
    "ObjectID": null,
    "CustomerKey": null,
    "Owner": null,
    "CorrelationID": null,
    "ObjectState": null,
    "IsPlatformObject": false
  }],
  "HasMoreRows": false
}
```

### Columns

When defining the colummns to retrieve data the order specificed in the array is the order in which the data will be retrieved example below

```javascript
// if the columns are defined in this order 
var cols = ["section", "content", "link", "time", "location", "position", "email-title"];

// the data retreived will be in the exact order

[{"Name":"section","Value":"event"}, {"Name":"content","Value":"The content of the event is contained here"}, {"Name":"link","Value":"https://www.google.com"}, {"Name":"time","Value":"1:00pm"}, {"Name":"location","Value":"Chapman Plaza"}, {"Name":"position","Value":"0"}, {"Name":"email-title","Value":"Event Title"}]
```

## EMAIL

To use Server Side Javascript to create an email this can be done through getting an access token and performing the appropriate Rest Api calls for the Content Builder Endpoint

### Creation

Email creation in SFMC is done through [Content Builder API](https://developer.salesforce.com/docs/atlas.en-us.noversion.mc-apis.meta/mc-apis/creating_an_email_via_the_web_service_api.htm) Not through WSProxy [See Salesforce Documentation on Content Builder API](https://developer.salesforce.com/docs/atlas.en-us.noversion.mc-apis.meta/mc-apis/routes.htm#detail_getObjectById) 

### Categories

A category is what a folder is called in Salesforce Marketing Cloud. They have specific types so to save an email in a category (folder) the category type must match

To save an email to a specific folder the `CategoryId` needs to be set to the appropriate folder, to find the Folder `CategoryId` navigate to `Content Builder` check the box for `Show Folders` and under the Gear Icon located on the right hand side make sure `ID` is selected and it should display the `ID` for that folder which is the `CategoryId`

## CONTENT BUILDER

Salesforce content builder is where all content for salesforce is held i.e. emails, images, code snippets, content blocks

### REST API

To perform CRUD operations Salesforce provides [a rest api to interact with](https://developer.salesforce.com/docs/atlas.en-us.mc-apis.meta/mc-apis/content-api.htm#!) In order to perform those operations though an authentication token must be provided with the request

### Token Auth

Token authorization for Salesforce Marketing Cloud must be done in a request with the appropriate token authoriztion headers [see documentation](https://developer.salesforce.com/docs/atlas.en-us.mc-app-development.meta/mc-app-development/access-token-s2s.htm#!). To create a rest api endpoint for token retrieval and rest api access you will need Michael or William to create an api integration [see documentation](https://developer.salesforce.com/docs/atlas.en-us.noversion.mc-app-development.meta/mc-app-development/api-integration.htm) once created they will provide you with a  client ID and client secret to use in your request for an auth token


## CONTENT BLOCKS (CUSTOM)

Custom Content Blocks can be used to create content for the digital marketing team for use in email & landing pages

## ISSUES

### Shared Publications Lists

#### Server-Side Javascscript - Retrievals

#### User Subscription List

#### Subscriber Object Retrieval

```javascript
<script runat=server>
    var subInit = Subscriber.Init('cbryant@chapman.edu.514000427');
    var subLists = subInit.Lists.Retrieve();
</script>
```

#### Response

The Response only dislays the two subscriptions of the `Strategic Marketing and Communications BU` and not the shared subscription list of `Diversity and Inclusion Newsletter`
```javascript
[{
  "List": {
    "ID": 697,
    "Name": "SMC Web Newsletter",
    "Description": "Strategic and Marketing newsletter about web news",
    "Type": "Public",
    "CreatedDate": "2021-01-04T22:26:13.283"
  },
  "CreatedDate": "2021-01-14T19:42:00.000",
  "Status": "Active"
}, {
  "List": {
    "ID": 707,
    "Name": "chris-test",
    "Description": "",
    "Type": "Public",
    "CreatedDate": "2021-01-12T23:28:25.600"
  },
  "CreatedDate": "2021-01-12T23:30:00.000",
  "Status": "Active"
}]
```

#### List Object Retrieval

When retrieving subscribers by list the external key is used this is the example and response for the list `chris-test` the subscriber is subscribed too

```javascript
<script runat=server>
    var myList = List.Init('chris-test - 2319');
    var subs = myList.Subscribers.Retrieve();
</script>
```

#### Response 

```javascript
[{
  "ID": 6932704,
  "EmailAddress": "cbryant@chapman.edu",
  "SubscriberKey": "cbryant@chapman.edu.514000427",
  "PartnerKey": null,
  "Status": "Active",
  "CreatedDate": "2020-12-17T20:35:00.000",
  "UnsubscribedDate": "0001-01-01T00:00:00.000",
  "EmailTypePreference": "HTML"
}]
```

The response is empty when using the external key for the shared subscription list `Diversity and Inclusion Newsletter`

```javascript
  var myList = List.Init('Diversity and Inclusion Newsletter ');
  var subs = myList.Subscribers.Retrieve();
```

##### Response 

```javascript
 [] 
```

## WSProxy Preview issue

When trying to preview WSProxy retrieves in the SFMC IDE theres an error that prevents WSProxy from working below is the error, This error looks like it believes the WSProxy is trying to retrieve in an email enviornment

```javascript
PROXY RETRIEVE ERROR
{"message":"Exception has been thrown by the target of an invocation.","description":"System.Reflection.TargetInvocationException: Exception has been thrown by the target of an invocation. - from mscorlib --> \r\n\r\n --- inner exception 1---\r\n\r\nExactTarget.OMM.FunctionExecutionException: WSProxy object is not valid in sendable content. This function is only allowed in non-sendable content.\r\n Object: Script.Util.WSProxy()\r\n Error Code: OMM_FUNC_CONTEXT_ERR\r\n - from OMMCommon\r\n\r\n\r\n\r\n"} 
```

## relevant trailhead

https://trailhead.salesforce.com/content/learn/modules/trailhead_basics
https://trailhead.salesforce.com/en/content/learn/trails/create-compelling-content-with-content-builder
https://trailhead.salesforce.com/content/learn/modules/content-builder-block-sdk
https://trailhead.salesforce.com/content/learn/modules/content-builder-basics
https://trailhead.salesforce.com/content/learn/modules/ampscript-for-nondevelopers
https://trailhead.salesforce.com/content/learn/modules/appexchange-solutions
https://trailhead.salesforce.com/content/learn/modules/marketing-cloud-developer-basics
https://trailhead.salesforce.com/content/learn/modules/marketing-cloud-programmatic-languages
https://trailhead.salesforce.com/content/learn/modules/content-builder-features