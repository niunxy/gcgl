import {
    observable,
    action
} from 'mobx'

class InfoStore {

    /**
     * @desc map 对象是否创建成功
     *
     * @type {boolean}
     * @memberof MapStore
     */

    @observable
    infoId: string = ''

    @action
    onSaveInfoId = (param) => {
        this.infoId = param
    }
}

export default new InfoStore()