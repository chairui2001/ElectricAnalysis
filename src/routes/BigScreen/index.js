import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Button } from 'antd';
import { ChartCard, Pie, Map, Line, Comb, Funnel } from 'components/Charts';
import styles from './index.less';
import { geodata } from './mapData';
import { intoFullscreen, exitFullscreen } from '../../utils/fullscreen';
import Bind from 'lodash-decorators/bind';

const BizCharts = require('bizcharts');

@connect(({ bigscreen, loading }) => ({
  bigscreen,
  loading: loading.effects['bigscreen/fetch'],
}))
export default class BigScreen extends PureComponent {
  state = {
    isFullscreen: false,
    sH: 150,
    bH: 200,
  };

  componentDidMount() {
    this.props.dispatch({
      type: 'bigscreen/fetch',
    });

    // 用来监听 ESC F11 等方式触发
    document.addEventListener('fullscreenchange', this.onFullscreenchange);
    document.addEventListener('webkitfullscreenchange', this.onFullscreenchange);
    document.addEventListener('mozfullscreenchange', this.onFullscreenchange);
    document.addEventListener('MSFullscreenChange', this.onFullscreenchange);
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'bigscreen/clear',
    });

    document.removeEventListener('fullscreenchange', this.onFullscreenchange);
    document.removeEventListener('webkitfullscreenchange', this.onFullscreenchange);
    document.removeEventListener('mozfullscreenchange', this.onFullscreenchange);
    document.removeEventListener('MSFullscreenChange', this.onFullscreenchange);

    BizCharts.setTheme('default');
  }

  @Bind()
  onFullscreenchange(e) {
    const { isFullscreen } = this.state;
    const H = window.screen.height - 42 - 14 - 20 - 20;
    const chartDiffH = 20 + 8 + 34;

    BizCharts.setTheme(isFullscreen ? 'default' : 'dark');

    this.setState({
      isFullscreen: !isFullscreen,
      sH: isFullscreen ? 150 : H * 0.3 - chartDiffH,
      bH: isFullscreen ? 200 : H * 0.4 - chartDiffH,
    });
  }

  @Bind()
  onPolygonClick(e) {
    console.log(e.data._origin.name);

    this.props.dispatch({
      type: 'bigscreen/fetch',
    });
  }

  render() {
    const { isFullscreen, sH, bH } = this.state;
    const { bigscreen, loading } = this.props;
    const { tradeData, userData, greenData, cpiData, priceData, trendData } = bigscreen;

    const gutter = 10;
    const mapH = sH * 2 + gutter + 64 + 64;

    return (
      <div className="bigscreen" ref={bigscreenDom => (this.bigscreenDom = bigscreenDom)}>
        <h1>
          用电数据一览
          <Button
            shape="circle"
            icon={isFullscreen ? 'shrink' : 'arrows-alt'}
            className={styles.fullscreenBtn}
            onClick={() => {
              isFullscreen ? exitFullscreen() : intoFullscreen(this.bigscreenDom);
            }}
          />
        </h1>

        <Row gutter={gutter}>
          <Col md={7}>
            <ChartCard title="交易量价" loading={loading}>
              <Comb
                height={sH}
                data={tradeData}
                titleMap={{
                  y1: '交易量',
                  y2: '价格',
                }}
              />
            </ChartCard>
            <ChartCard title="用户数" loading={loading} style={{ marginTop: gutter }}>
              <Funnel height={sH} data={userData} />
            </ChartCard>
          </Col>
          <Col md={10}>
            {/* <ChartCard title="云南地图" loading={loading}> */}
            <Map height={mapH} geodata={geodata} onPolygonClick={this.onPolygonClick} />
            {/* </ChartCard> */}
          </Col>
          <Col md={7}>
            <ChartCard title="绿色能源占比" loading={loading}>
              <Pie inner={0} data={greenData} height={sH} lineWidth={4} />
            </ChartCard>
            <ChartCard title="CPI/GDP/PMI" loading={loading} style={{ marginTop: gutter }}>
              {cpiData.length > 0 && (
                <Line
                  height={sH}
                  data={cpiData}
                  titleMap={{
                    y1: 'CPI',
                    y2: 'GDP',
                    y3: 'PMI',
                  }}
                />
              )}
            </ChartCard>
          </Col>
        </Row>
        <Row gutter={gutter} style={{ marginTop: gutter }}>
          <Col md={8}>
            <ChartCard title="行业价格和成本" loading={loading}>
              <Comb
                height={bH}
                data={priceData}
                titleMap={{
                  y1: '价格',
                  y2: '成本',
                }}
                typeMap={{
                  y1: 'area',
                  y2: 'area',
                }}
              />
            </ChartCard>
          </Col>
          <Col md={4}>
            <ChartCard title="电解铝" loading={loading}>
              <Pie animate={false} percent={28} total="28%" height={bH} lineWidth={2} />
            </ChartCard>
          </Col>
          <Col md={4}>
            <ChartCard title="电解硅" loading={loading}>
              <Pie animate={false} percent={21} total="21%" height={bH} lineWidth={2} />
            </ChartCard>
          </Col>
          <Col md={8}>
            <ChartCard title="主要能源价格走势" loading={loading}>
              <Comb
                height={bH}
                data={trendData}
                titleMap={{
                  y1: '煤炭',
                  y2: '石油',
                }}
                typeMap={{
                  y1: 'line',
                  y2: 'area',
                }}
              />
            </ChartCard>
          </Col>
        </Row>
      </div>
    );
  }
}
