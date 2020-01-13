import local from './StorageUtil'

export const shouldCreate = () => {
    const menu = local.getLocalStorage('menuData')
    const one = menu.find((item) => {
        return item.name === '首页'
    })
    const final = one.child.find((value) => {
        return value.name === '创建项目'
    })
    if (final) {
        return true
    } else {
        return false
    }
}

export const shouldScreen = () => {
    const menu = local.getLocalStorage('menuData')
    const one = menu.find((item) => {
        return item.name === '首页'
    })
    const final = one.child.find((value) => {
        return value.name === '预立项'
    })

    if (final.child.includes('地块筛选')) {
        return true
    } else {
        return false
    }
}
export const shouldParcel = () => {
    const menu = local.getLocalStorage('menuData')
    const one = menu.find((item) => {
        return item.name === '首页'
    })
    const final = one.child.find((value) => {
        return value.name === '实施项目'
    })

    if (final.child.includes('地块分包')) {
        return true
    } else {
        return false
    }
}
export const shouldCanParcel = () => {
    const menu = local.getLocalStorage('menuData')
    const one = menu.find((item) => {
        return item.name === '首页'
    })
    const final = one.child.find((value) => {
        return value.name === '实施项目'
    })

    if (final.child.includes('分包')) {
        return true
    } else {
        return false
    }
}