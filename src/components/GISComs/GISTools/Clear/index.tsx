
import React from 'react'
import ToolItem from '../ToolItem'
import './index.less'
import {Icon} from 'antd'

interface ITool {
  className?: string,
  tips: string,
  placement: string,
  handler: () => void
}
interface IProps {
  /**
   * 样式
   */
  className?: string,
  /**
   * view 对象
   */
  view: any 
  /**
   * 工具条的方向， 默认水平
   */
  orientation?: 'row' | 'row-reverse' | 'column' | 'column-reverse',
}

interface IState {
  orientation?: 'row' | 'row-reverse' | 'column' | 'column-reverse', // 工具条的方向， 默认水平
  toolArr?: ITool[], // 工具条工具集合
}
export default class Clear extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    this.state = {
      orientation: this.props.orientation ? this.props.orientation : 'row',
      toolArr: [
        {
          tips: '清除',
          handler: this.clear,
          placement: 'left'
        }
      ],
    }
  }

  clear = () => {
    this.props.view.graphics.removeAll()
  }

	/**
	 * @desc 渲染工具条
	 */
  renderToolBar = () => {
    return this.state.toolArr!.map((item, key) => {
      return (
        <ToolItem key={key} tips={item.tips} onClick={item.handler.bind(this)} placement={item.placement} >
          {/* 清除 */}
          <Icon type='delete' />
        </ToolItem>
      )
    })
  }
  render() {
    const toolbar = this.renderToolBar()
    return (
      <div  className={`${'clear-wrap ' + (this.props.className ? this.props.className : '')}`}>
        {toolbar}
      </div>
    )
  }
}