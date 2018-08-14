import React, {
	Component,
} from 'react';
import {
	WebView,
	StyleSheet,
	Platform,
} from 'react-native';
import PropTypes from 'prop-types';
/**
 * 渲染图表脚本的模版，设置时将CONFIG参数替换成对应的值
 * @type {[string]}
 */
var getSettingChartScript = (chartConfiguration, defaultFontSize = 12) => (`
	Chart.defaults.global.defaultFontSize=${defaultFontSize};
	var ctx = document.getElementById("myChart").getContext('2d');
	myChart = new Chart( ctx, ${JSON.stringify( chartConfiguration )} );
`);

export default class Chart extends Component {
	
	static propTypes = {
		/**
		 * 图表配置参数，对应chart.js中初始化需要的参数
		 * @type {[object]}
		 */
		chartConfiguration: PropTypes.object.isRequired,
		defaultFontSize : PropTypes.number
	}
	
	static defaultProps = {
		defaultFontSize: 12,
	};

	componentWillReceiveProps(nextProps) {
		if ( nextProps.chartConfiguration !== this.props.chartConfiguration
			|| nextProps.defaultFontSize !== this.props.defaultFontSize ) {
			this.setChart(nextProps.chartConfiguration, nextProps.defaultFontSize );
		}
	}

	setChart(chartConfiguration, defaultFontSize) {
		if( !chartConfiguration) {
			return;
		}
		this.webview && this.webview.injectJavaScript( 
			getSettingChartScript(chartConfiguration, defaultFontSize)
		);
	}

	render() {
		const path = Platform.OS === 'ios' ? require('./dist/index.html') : {uri: 'file:///android_asset/chartjs/index.html'}
		return ( 
			<WebView 
				style={{ 
					flex : 1,
					...this.props.style,
				}}
				ref={ref => {
					this.webview = ref
				}}
				injectedJavaScript={
					getSettingChartScript( this.props.chartConfiguration, this.props.defaultFontSize)
				}
				source = {path}
				onError = {
					(error) => {
						console.log(error)
					}
				}
				scalesPageToFit = { true }
				{...this.props.webViewProps}
			/>
		);
	}
}
