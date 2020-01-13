import { configure } from 'mobx'

/** 
 * 启用 mobx 严格模式，严格模式下不允许直接修改 @observable 修饰的数据，需 @action 修饰的方法来修改。原则上必须用严格模式。
 * 
 */
configure({ enforceActions: 'observed' })



import mapStore from './map.store'
import infoStore from './info.store'

const stores = {
    mapStore,
    infoStore
}

export default stores
