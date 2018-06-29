import React from 'react';
import { Chart, Tooltip, Geom, Legend, Axis, Coord, Guide } from 'bizcharts';
import DataSet from '@antv/data-set';
import autoHeight from '../autoHeight';
import styles from '../index.less';

const { Text } = Guide;

@autoHeight()
export default class Funnel extends React.Component {
  render() {
    const { title, height = 400, padding = 'auto', data = [] } = this.props;

    const ds = new DataSet();

    const dv = ds.createView();

    if (data.length > 0) {
      dv.source(data).transform({
        type: 'percent',
        field: 'y',
        dimension: 'x',
        as: 'percent',
      });
    }

    const cols = {
      percent: {
        nice: false,
      },
    };

    return (
      <div className={styles.chart} style={{ height }}>
        <div>
          {title && <h4>{title}</h4>}
          {data.length > 0 && (
            <Chart height={height} padding={padding} data={dv} forceFit>
              <Tooltip
                showTitle={false}
                itemTpl="<li data-index={index} style=&quot;margin-bottom:4px;&quot;><span style=&quot;background-color:{color};&quot; class=&quot;g2-tooltip-marker&quot;></span>{name}<br/><span style=&quot;padding-left: 16px&quot;>人数：{num}</span><br/><span style=&quot;padding-left: 16px&quot;>占比：{percent}</span><br/></li>"
              />
              <Coord type="rect" transpose scale={[1, -1]} />
              <Guide>
                {dv.rows.map(obj => {
                  return (
                    <Text
                      key={obj.x}
                      top={true}
                      position={{
                        x: obj.x,
                        percent: 'median',
                      }}
                      content={parseInt(obj.percent * 100) + '%'}
                      style={{
                        fill: '#fff',
                        fontSize: '12',
                        textAlign: 'center',
                        shadowBlur: 2,
                        shadowColor: 'rgba(0, 0, 0, .45)',
                      }}
                    />
                  );
                })}
              </Guide>
              <Geom
                type="intervalSymmetric"
                position="x*percent"
                shape="funnel"
                color={['x', ['#0050B3', '#1890FF', '#40A9FF', '#69C0FF', '#BAE7FF']]}
                tooltip={[
                  'x*y*percent',
                  (x, y, percent) => {
                    return {
                      name: x,
                      num: y,
                      percent: parseInt(percent * 100) + '%',
                    };
                  },
                ]}
              />
            </Chart>
          )}
        </div>
      </div>
    );
  }
}
