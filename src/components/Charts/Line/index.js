import React from 'react';
import { Chart, Tooltip, Geom, Legend, Axis } from 'bizcharts';
import DataSet from '@antv/data-set';
import autoHeight from '../autoHeight';
import styles from '../index.less';

@autoHeight()
export default class Line extends React.Component {
  render() {
    const {
      title,
      height = 400,
      padding = 'auto',
      titleMap = {
        y1: 'y1',
        y2: 'y2',
        y3: 'y3',
      },
      data = [
        {
          x: 0,
          y1: 0,
          y2: 0,
          y3: 0,
        },
      ],
    } = this.props;

    const ds = new DataSet();

    const dv = ds.createView();
    dv.source(data)
      .transform({
        type: 'map',
        callback(row) {
          const newRow = { ...row };
          newRow[titleMap.y1] = row.y1;
          newRow[titleMap.y2] = row.y2;
          newRow[titleMap.y3] = row.y3;
          return newRow;
        },
      })
      .transform({
        type: 'fold',
        fields: [titleMap.y1, titleMap.y2, titleMap.y3], // 展开字段集
        key: 'key', // key字段
        value: 'value', // value字段
      });

    const cols = {
      x: {
        range: [0, 1],
      },
    };

    return (
      <div className={styles.chart} style={{ height }}>
        <div>
          {title && <h4>{title}</h4>}
          <Chart height={height} padding={padding} data={dv} forceFit>
            <Axis name="x" />
            <Tooltip />
            {/* <Legend name="key" /> */}
            <Geom type="line" position="x*value" color="key" />
          </Chart>
        </div>
      </div>
    );
  }
}
