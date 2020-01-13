/**
 * @author Roman
 * @date 2019/12/21 
 * @Description: cesium-view多屏复制
 */
function MultipleScreen (this: any) {
    const that = this
    // 三屏操作
    this.setThreeScreenCopy = (view1, view2, view3) => {
        view1.camera.percentageChanged = 0.001
        view2.camera.percentageChanged = 0.001
        view3.camera.percentageChanged = 0.001
        view1.camera.changed.addEventListener( () => {
            that._cameraCopy(view1, view2)
            that._cameraCopy(view1, view3)
        })
        view2.camera.changed.addEventListener( () => {
            that._cameraCopy(view2, view1)
            that._cameraCopy(view2, view3)
        })
        view3.camera.changed.addEventListener( () => {
            that._cameraCopy(view3, view1)
            that._cameraCopy(view3, view2)
        })
    }
    // 四屏操作
    this.setFourScreenCopy = (view1, view2, view3, view4) => {
        view1.camera.percentageChanged = 0.001
        view2.camera.percentageChanged = 0.001
        view3.camera.percentageChanged = 0.001
        view4.camera.percentageChanged = 0.001
        view1.camera.changed.addEventListener( () => {
            that._cameraCopy(view1, view2)
            that._cameraCopy(view1, view3)
            that._cameraCopy(view1, view4)
        })
        view2.camera.changed.addEventListener( () => {
            that._cameraCopy(view2, view1)
            that._cameraCopy(view2, view3)
            that._cameraCopy(view2, view4)
        })
        view3.camera.changed.addEventListener( () => {
            that._cameraCopy(view3, view1)
            that._cameraCopy(view3, view2)
            that._cameraCopy(view3, view4)
        })
        view4.camera.changed.addEventListener( () => {
            that._cameraCopy(view4, view1)
            that._cameraCopy(view4, view2)
            that._cameraCopy(view4, view3)
        })
    }
}
MultipleScreen.prototype._cameraCopy = (view, copyView) => {
    copyView.camera.position = view.camera.position.clone()
    copyView.camera.setView({
        orientation: {
            up: view.camera.up,
            direction: view.camera.direction
        }
    })
}

export default MultipleScreen
