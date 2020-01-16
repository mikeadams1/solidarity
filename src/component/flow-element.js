import { LitElement, html } from 'lit-element';

import { HelloAgent } from '../agents/hello-agent.js';
import data from "@solid/query-ldflex";

import './document-element.js'

class FlowElement extends LitElement {

  static get properties() {
    return {
      name: {type: String},
      something: {type: String},
      person: {type: Object},
      documents:  {type: Object},
      classe: {type: String},
    };
  }

  constructor() {
    super();
    this.something = "Flow Element"
    this.person = {instances: []}
    this.documents = []
    this.classe = ""
  }

  render(){
    return html`
    <h4>${this.something}</h4>
    ${this.person.name}


    ${this.person.instances.map((i) => html`
      <div class = "row">
      <div class = "col">

      <button type="button"
      class="btn btn-primary btn-sm"
      url="${i.object}"
      classe = "${i.classe}"
      @click="${this.open}">${this.cutStorage(i.object)}</button>(${this.localName(i.classe)})
      </div>
      </div>
      `
    )}

    ${this.documents.length} documents of type ${this.classe}

    ${this.documents.map((d, index) => html`
      <document-element url="${d}" name="Document${index}">.</document-element>
      `)}
      `;
    }

    async open(e){
      var url = e.target.getAttribute("url")
      this.classe = e.target.getAttribute("classe")
      console.log(url)
      var folder = url.substring(0,url.lastIndexOf('/')+1)
      console.log("FOLDER",folder)
      // find tast chat file



      //  var path = folder+[year,month,day+1,""].join('/')
      var lastmod = await data[folder]['http://purl.org/dc/terms/modified']

      console.log("lastmod",`${lastmod}`);
      var dateObj = new Date(lastmod);
      var month = ("0" + dateObj.getUTCMonth() + 1).slice(-2); //months from 1-12
      var day = ("0" + dateObj.getUTCDate()).slice(-2);
      var year = dateObj.getUTCFullYear();

      var path = folder+[year,month,day,""].join('/')
      console.log(path)
      let chatfile = await data[path]['ldp$contains'];
      console.log("ChatFile",`${chatfile}`);

      /*let chatfile = await (data[path]['ldp$contains']).catch(
      (err) => {
      console.log(err);
    })
    console.log("ChatFile",`${chatfile}`);*/

    /*  for await (const year of data[folder]['ldp$contains']){
    console.log("YEAR",`${year}`);
    if ( `${year}` != url.substring(0, url.lastIndexOf('#')+1)){

    for await (const month of data[`${year}`]['ldp$contains']){
    console.log("month", `${year}`, `${month}`);
    var days = []
    for await (const day of data[`${month}`]['ldp$contains']){
    console.log("day", `${year}`, `${month}`, `${day}`);
    days.push(this.localName(`${day}`.slice(0, -1)))
    console.log(days.sort())
  }
}
}
}*/
/*
let documents = []
this.documents = []
for await (const participation of data[url]['http://www.w3.org/2005/01/wf/flow#participation']){
console.log(`${participation}`);
const doc = `${participation}`
documents.push(doc)
}
console.log(documents)
this.documents = documents*/
}


async openWITHDOCS(e){
  var url = e.target.getAttribute("url")
  this.classe = e.target.getAttribute("classe")
  console.log(url)
  let documents = []
  this.documents = []
  for await (const subject of data[url].subjects){
    console.log(`${subject}`);
    const doc = `${subject}`
    documents.push(doc)
  }

  this.documents = documents
}

cutStorage(str){
  return str.replace(this.person.storage,"/")
}

localName(str){
  var ln = str.substring(str.lastIndexOf('#')+1);
  console.log(ln)
  ln == str ? ln = str.substring(str.lastIndexOf('/')+1) : "";
  return ln
}

firstUpdated(){
  var app = this;
  this.agent = new HelloAgent(this.name);
  console.log(this.agent)
  this.agent.receive = function(from, message) {
    //  console.log("messah",message)
    if (message.hasOwnProperty("action")){
      //  console.log(message)
      switch(message.action) {
        case "webIdChanged":
        app.webIdChanged(message.webId)
        break;
        case "personChanged":
        app.personChanged(message.person)
        break;
        default:
        console.log("Unknown action ",message)
      }
    }
  };
}

personChanged(person){
  this.person = person
}

webIdChanged(webId){
  this.webId = webId
  if (webId != null){
    this.updateProfile();
  }else{

  }
}

}

customElements.define('flow-element', FlowElement);
