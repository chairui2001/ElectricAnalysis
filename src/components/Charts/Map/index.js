import React from 'react';
import { Chart, Geom, Tooltip, Label, Guide } from 'bizcharts';
import DataSet from '@antv/data-set';
import autoHeight from '../autoHeight';
import styles from '../index.less';

const { Text } = Guide;

@autoHeight()
export default class Map extends React.Component {
  state = {
    dv: null,
  };

  componentDidMount() {
    const { geodata } = this.props;

    this.renderG2Map(geodata);
  }

  processData(geoJSON) {
    const mapData = {
      type: 'FeatureCollection',
      features: geoJSON,
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

  renderG2Map(geodata) {
    const geoJSON = geodata; // 获取 geoJSON 数据

    const dv = this.processData(geoJSON);

    this.setState({ dv });
  }

  render() {
    const { dv } = this.state;

    const { title, height = 400, onPolygonClick } = this.props;

    return (
      <div className={styles.chart} style={{ height }}>
        <div>
          {title && <h4>{title}</h4>}
          <Chart
            height={title ? height - 41 : height}
            forceFit={true}
            data={dv}
            padding={0}
            onPolygonClick={onPolygonClick}
          >
            <Tooltip showTitle={false} />
            <Geom
              type="polygon"
              position="longitude*lantitude"
              select={{
                // 设置是否允许选中以及选中样式
                mode: 'single', // 多选还是单选
                style: {
                  fill: '#2FC25B', // 选中的样式
                },
              }}
              tooltip="name*value"
              style={{ stroke: '#fff', lineWidth: 1 }}
              color={['value', '#BAE7FF-#1890FF-#0050B3']}
              // color='name'
            >
              <Label
                content="name"
                textStyle={{
                  fill: '#fff',
                  fontSize: 10,
                  shadowBlur: 2,
                  shadowColor: 'rgba(0, 0, 0, .45)',
                }}
              />
            </Geom>
            <Guide>
              <Text
                offsetY={20}
                content={name}
                position={['min', 'max']}
                style={{ fontSize: 14, fontWeight: 'bold' }}
              />
            </Guide>
          </Chart>
        </div>
      </div>
    );
  }
}
