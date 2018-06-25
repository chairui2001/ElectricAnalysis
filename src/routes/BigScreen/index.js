import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
/* import { connect } from 'dva';
import { Row, Col, Card, Tooltip } from 'antd';
import numeral from 'numeral';
import { Pie, WaterWave, Gauge, TagCloud } from 'components/Charts';
import NumberInfo from 'components/NumberInfo';
import CountDown from 'components/CountDown';
import ActiveChart from 'components/ActiveChart';
import Authorized from '../../utils/Authorized'; */
import { Row, Col } from 'antd';
import {
  ChartCard,
  yuan,
  MiniArea,
  MiniProgress,
  Field,
  Bar,
  Pie,
  TimelineChart,
} from 'components/Charts';
import styles from './index.less';
import { geodata_yunnan } from './mapData';
import { Chart, Geom, Tooltip, Label, Guide } from 'bizcharts';
import DataSet from '@antv/data-set';
const { Text } = Guide;

/* const { Secured } = Authorized;

const targetTime = new Date().getTime() + 3900000;

// use permission as a parameter
const havePermissionAsync = new Promise(resolve => {
  // Call resolve on behalf of passed
  setTimeout(() => resolve(), 1000);
});
@Secured(havePermissionAsync)
@connect(({ monitor, loading }) => ({
  monitor,
  loading: loading.models.monitor,
})) */

@connect(({ chart, loading }) => ({
  chart,
  loading: loading.effects['chart/fetch'],
}))

export default class BigScreen extends PureComponent {
  state = {
    width: 200,
    height: 200,
    name: '',
    dv: ''
  }
  processData(geoJSON) {
    const mapData = {
    type: 'FeatureCollection',
    features: geoJSON
    };
    // 构造虚拟数据
    const userData = [];
    for (let i = 0; i < geoJSON.length; i++) {
    const name = geoJSON[i].properties.name;
    userData.push({
        name: name,
        value: Math.round(Math.random() * 1000),
    });
    }
    const ds = new DataSet();
    const geoDataView = ds.createView().source(mapData, {
    type: 'GeoJSON',
    }); // geoJSON 经纬度数据

    // 用户数据
    const dvData = ds.createView().source(userData);
    dvData.transform({
    type: 'geo.region',
    field: 'name',
    geoDataView: geoDataView,
    as: ['longitude', 'lantitude'],
    });

    return dvData;
  }

  renderG2Map(){
    const geoJSON = geodata_yunnan; // 获取 geoJSON 数据

    const dv = this.processData(geoJSON);
    // start: 计算地图的最佳宽高
    const longitudeRange = dv.range('longitude');
    const lantitudeRange = dv.range('lantitude');
    const ratio = (longitudeRange[1] - longitudeRange[0]) / (lantitudeRange[1] - lantitudeRange[0]);
    let width;
    let height;
    if (ratio > 1) {
      width = 1100;
      height = width / ratio;
    } else {
      height = 900;
      width = height * ratio;
    }
    // end: 计算地图的最佳宽高
    this.setState({width,height,name,dv});
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'chart/fetch',
    });
    
    this.renderG2Map();
  }

  render() {
    const { height, width, name, dv } = this.state;
    const { chart, loading } = this.props;
    const {
      salesData
    } = chart;

    return (
      <Row>
        <Col><Bar height={295} title="销售额趋势" data={salesData} /></Col>
        <Col>
          <Chart height={height} width={width} data={dv} padding={0}>
            <Tooltip showTitle={false} />
            <Geom
              type='polygon'
              position='longitude*lantitude'
              select={{
                // 设置是否允许选中以及选中样式
                mode: 'single', // 多选还是单选
                style: {
                  fill: '#1890ff', // 选中的样式
                },
              }}
              tooltip='name'
              style={{stroke: '#fff',lineWidth: 1}}
              color={['value', '#BAE7FF-#1890FF-#0050B3']}
              >
              <Label content='name' textStyle= {{
                fill: '#fff',
                fontSize: 10,
                shadowBlur: 2,
                shadowColor: 'rgba(0, 0, 0, .45)'
                }} />
              </Geom>
              <Guide>
                <Text
                  offsetY={20}
                  content={name}
                  position={[ 'min', 'max']}
                  style={{fontSize: 14,fontWeight: 'bold'}} />
              </Guide>
          </Chart>
        </Col>
      </Row>
    );
  }
}
