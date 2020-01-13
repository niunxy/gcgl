import * as React from 'react'
import './slider.less'
interface IProps {
    
}

interface IState {
    slider: any,
    thunk: any,
    min: number,
    max: number,
    per: number
}
export default class Slide extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props)
        this.state = {
            slider: React.createRef(),
            thunk: React.createRef(),
            min: 0,
            max: 100,
            per: 20
        }
    }

    width = () => {
        if (this.state.slider.current) {
            return this.state.slider.current.offsetWidth * this.scale()
            // return this.state.slider.current.offsetWidth * this.state.per
        } else {
            return 0
        }
    }

    scale = () => {
        return (this.state.per - this.state.min) / (this.state.max - this.state.min)
    }

    left = () => {
        if (this.state.slider.current) {
          return this.state.slider.current.offsetWidth * this.scale() -  this.state.thunk.current.offsetWidth / 2
        } else {
          return 0
        }
    }

    componentDidMount() {
        const slider = this.state.slider.current
        const thunk = this.state.thunk.current
        thunk.onmousedown = (e) => {
            const width = this.width()
            const disX = e.clientX
            document.onmousemove = (event) => {
                // value, left, width
                // 当value变化的时候，会通过计算属性修改left，width

                // 拖拽的时候获取的新width
                const newWidth = event.clientX - disX + width
                // 拖拽的时候得到新的百分比
                const scale = newWidth / slider.offsetWidth
                
                let per = Math.ceil((this.state.max - this.state.min) * scale + this.state.min)
                per = Math.max(per, this.state.min)
                per = Math.min(per, this.state.max)
                this.setState({
                    per
                })
            }
            document.onmouseup = () => {
                document.onmousemove = document.onmouseup = null
            }
            return false
        }
    }

    render() {
        return (
            <div className='slider' ref={this.state.slider}>
                <div className='process' style={{width: this.width() + 'px'}} />
                <div className='thunk' ref={this.state.thunk} style={{left: this.left() + 'px'}}>
                    <div className='block'/>
                    {/* <div className='tips'>
                        <span>100</span>
                        
                    </div> */}
                </div>
            </div >
        )
    }
}