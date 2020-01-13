import React from 'react'
import './index.less'
import { Tooltip } from 'antd'


interface IProps {
  className?: string, 
  tips?: string,       // 提示信息 tips
  placement?: string,  // tips 展示的位置，可选值有 left,Right、bottom、top、等12个可选值，默认为 top,详情参考 antd 的 Tooltip 组件
  onClick: () => void
}
interface IState {
  className: string,    
  tips?: string,      // 提示信息 tips
  placement?: any     // tips 展示的位置，可选值有 left,Right、bottom、top、等12个可选值，默认为 top,详情参考 antd 的 Tooltip 组件
}

/**
 * @deac ToolItem - 可复用工具项
 * @author duxx
 */
export default class ToolItem extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    this.state = {
      className: this.props.className ? this.props.className : '',
      tips: this.props.tips ? this.props.tips : '工具',
      placement: this.props.placement ? this.props.placement : 'top'
    }
  }

  clickHandle = () => {
    this.props.onClick!()
  }

  render() {
    return (
      <Tooltip placement={this.state.placement!} title={this.state.tips!}>
        <div className={`toolItem ` + this.state.className} onClick={this.clickHandle.bind(this)}>
            {this.props.children}
        </div>
      </Tooltip>
    )
  }
}

