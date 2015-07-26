# CassyHub
Module to integrate your Express application with Cassyhub.

Cassyhub is a solution for Content as a Service that integrates into your websites. CassyHub allows content editors and publishers to create their content in a simple and easy to use cloud based environment. Developers can then directly integrate the content into websites or other systems, letting the content editors maintain control over content while developers focus on system functionality.

![Screenshot of CassyHub]
(http://i.imgur.com/FignB3p.png)

### Install
```sh
$ npm install cassy-hub --save
```

### Usage
Within your app.js
```javascript
var cassyhub = require('./cassy-hub');

cassyhub.setup({
    "id": "<YOUR_CASSYHUB_API_ID>",
    "secret": "<YOUR_CASSYHUB_API_SECRET>"
});
app.use(cassyhub.init);
```
Within your EJS templace you can call the following function to get your content:
```javascript
<%- ___('home/description') %>
```
This will get the piece of content with tag 'home/description' from your Cassyhub account.

Within the cassyhub setup you can set the following options:

- host: where Cassyhub is installed (defaulted to cassyhub.io)
- protocol: http or https (defaulted to http),
- port: the port Cassyhub is running (defaulted to 80),
- initialContentRetrieval: when do get the content when your app starts (in seconds - defaulted to 10),
- resetContentInterval: how often to retrieve your content (in hours - defaulted to 1),
- startTag: if you want to only retrieve a subset of all your content tages (defaulted to whole tree),
- language: will add a locale tag to the end of your content tag (defaulted to false),
- supportedLanguages: supported languages (defaulted to ["en", "es"])

### Language support
If you turn languages on then the browsers locale will get appended to each tag and the content for that locale will get delivered. For example:
```javascript
<%- ___('home/description') %>
```

If the browsers locale is set to 'en' then the content on Cassyhub with tag 'home/description/en' will be delivered.

Conversly if the browsers locale is set to 'es' then the content on Cassyhub with tag 'home/description/es' will be delivered.

### Content creation

When the module cannot find a tag on Cassyhub, it will create the tag for you with an empty piece of content. This allows you to create all your tags first so you can just get your content writers to login to Cassyhub and fill in the blanks!