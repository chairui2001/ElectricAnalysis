import React from 'react';
import { Chart, Tooltip, Geom, Legend, Axis } from 'bizcharts';
import DataSet from '@antv/data-set';
import autoHeight from '../autoHeight';
import styles from '../index.less';

@autoHeight()
export default class Comb extends React.Component {
  render() {
    const {
      title,
      height = 400,
      padding = 'auto',
      titleMap = {
        y1: 'y1',
        y2: 'y2',
      },
      typeMap = {
        y1: 'interval',
        y2: 'line',
      },
      data = [
        {
          x: 0,
          y1: 0,
          y2: 0,
        },
      ],
    } = this.props;

    const ds = new DataSet();

    const dv = ds.createView();
    dv.source(data).transform({
      type: 'map',
      callback(row) {
        const newRow = { ...row };
        newRow[titleMap.y1] = row.y1;
        newRow[titleMap.y2] = row.y2;
        return newRow;
      },
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
            <Axis
              name={titleMap.y2}
              grid={null}
              label={{
                textStyle: {
                  fill: '#ffaa00',
                },
              }}
            />
            <Tooltip />
            <Geom type={typeMap.y1} position={'x*' + titleMap.y1} />
            <Geom type={typeMap.y2} position={'x*' + titleMap.y2} color="#2FC25B" />
          </Chart>
        </div>
      </div>
    );
  }
}
