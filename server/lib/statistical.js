import {getStat} from '../services/database'

export default class Statistical {
    constructor(opts)
    {
        this.opts = opts
    }

    async getStatDevice(id){
        return await getStat(this.opts, id)
    }
}
