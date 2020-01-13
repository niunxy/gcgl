import * as React from 'react'
import './index.less'
import { Layout } from 'antd'

const { Footer } = Layout

export default class BasicFooter extends React.Component {
	render() {
		return (
			<div className='footer'>
				<Footer>
				<div className='footer-line external-links'>
					<span>
						<label className='external-link-item'>关于我们</label>
						<label className='external-link-item'>联系我们</label>
						<label className='external-link-item'>免费声明</label>
						<label className='external-link-item'>友情链接</label>
						<label className='external-link-item'>问题反馈</label>
					</span>
				</div>
				<div className='footer-line'>
					<span>版权所有 : © 2019 陕西自然资源勘测规划设计院股份有限公司   <label> 技术支持 : xxxxxxxxxxxxxxxxxxxx </label></span>
				</div>
				<div className='footer-line'>
					<span> 备案号：xxxxxxxxxxxxxxxxxxxx </span>
				</div>
			</Footer>
			</div>
		)
	}
}