import NodeModel from '../models/node'
import PropertyModel from '../models/property'
import PropertyHistoryModel from '../models/property-history'

export default class Statistical {
    constructor(opts)
    {
        this.opts = opts
        this.comteur = 0
        
    }
    

    async getStatDevice(id){
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
                                value: resultInDb.attributes["value"],
                                date: this.timeConverter(resultInDb.attributes["date"])
                            })
                        }
                })
              }
              
            })
        })
        
        return dataReturn
       
    }

    timeConverter(UNIX_timestamp){
        var a = new Date(UNIX_timestamp );
        
        var year = a.getFullYear();
        var month = a.getMonth();
        var date = a.getDate();
        var hour = a.getHours();
        var min = a.getMinutes();
        var sec = a.getSeconds();
        var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
        return time;
    }
}
