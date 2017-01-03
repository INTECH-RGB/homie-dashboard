import NodeModel from '../models/node'
import PropertyModel from '../models/property'
import PropertyHistoryModel from '../models/property-history'

export default class Statistical {
    constructor(opts)
    {
        this.opts = opts
    }
    

    async getStatDevice(id, interval){
        var dataReturn = []
        
        await NodeModel.query({where: {device_node_id: id}}).fetch()
        .then(async (node_models) => {
            await PropertyModel.query({where: {node_id: node_models.attributes["id"]}}).fetchAll().then(async (property_node) => {
              for(const propertyInDb of property_node.models)
              {
                 await PropertyHistoryModel.query({where: {property_id: propertyInDb.attributes["id"]}}).fetchAll().then(async (result) => {
                        
                        for(const resultInDb of result.models)
                        {
                            dataReturn.push({
                                id: resultInDb.attributes["id"],
                                property_id: resultInDb.attributes["property_id"],
                                node_property_id: propertyInDb.attributes["node_property_id"],
                                value: resultInDb.attributes["value"],
                                date: resultInDb.attributes["date"]
                            })
                        }
                })
              }
              
            })
        })
        switch(interval){
            case "day":
            dataReturn = this.parseByDay(dataReturn)
            break
            case "week":
            dataReturn = this.parseByWeek(dataReturn)
            break
            default: 
            break
        }
        return dataReturn
       
    }

    timeConverter(UNIX_timestamp, interval){
        var a = new Date(UNIX_timestamp );
        var days = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"]

        var year = a.getFullYear();
        var month = a.getMonth();
        var date = a.getDate();
        var hour = a.getHours();
        var min = a.getMinutes();
        var sec = a.getSeconds();
        var day = days[a.getDay()];

        switch(interval){
            case 'day':
            var time =  day + ' à ' + hour
            break
            case 'week':
            var time = day + ' ' + date
            break
            default:
            var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
            break
        }
        return time;
    }

    parseByDay(data){
        var time = Math.round(new Date().getTime() / 1000);
        var timeLast = time - (24 * 3600);

        var dataTmp = []
        var dataReturn = []

        data.forEach((element) => {
            if(Math.round(new Date(element.date).getTime() / 1000) >= timeLast){
                dataTmp.push({
                    id: element.id,
                    property_id: element.property_id,
                    node_property_id: element.node_property_id,
                    value: element.value,
                    date: this.timeConverter(element.date, 'day')
                })
            }
        })
        var d3 = require("d3");

        var expenses = d3.nest()
        .key(function(d) { return d.date; })
        .key(function(d) { return d.property_id; })
        .rollup(function(v) { return {

            avg: d3.mean(v, function(d) { return d.value; })
        }; })
        .map(dataTmp);
        console.log(expenses);


        return data;
    }

    parseByWeek(data){
        return data;
    }
}
