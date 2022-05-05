import React, { useEffect, useRef, useState } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import data from "./Data";
import { GithubPicker, TwitterPicker, BlockPicker } from "react-color";
const ChartApp = () => {
  let rootChart = useRef();
  let firstRender = useRef(true);

  const [state, setState] = useState({
    strokeColor: "#262626",
    strokeWidth: 1,
    cornerRadiusTL: 0,
    cornerRadiusTR: 0,
    seriesWidth: 50,
    isCursor: false,
    isLegend: false,
    isZoom: false,
    isTooltip: false,
    list: "data1",
  });

  const [toolTip, setToolTip] = useState({
    strokeColor: "black",
    textColor: "#fff",
    strokeWidth: 1,
  });

  useEffect(() => {
    if (firstRender.current) {
      let root = am5.Root.new("chartdiv");
      rootChart.current = root;
      firstRender.current = false;
      let barChart = createBarChart(state);
      return () => {
        barChart.dispose();
      };
    } else {
      let barChart = createBarChart(state);
      return () => {
        barChart.dispose();
      };
    }
  }, [state, toolTip]);
  function createBarChart() {
    rootChart.current.setThemes([am5themes_Animated.new(rootChart.current)]);
    let chart = rootChart.current.container.children.push(
      am5xy.XYChart.new(rootChart.current, {
        panY: false,
        layout: rootChart.current.verticalLayout,
        panX: true,
        wheelX: "zoomX",
      })
    );

    //Create Y-Axis
    let yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(rootChart.current, {
        renderer: am5xy.AxisRendererY.new(rootChart.current, {}),
      })
    );
    yAxis.data.setAll(data[state.list]);

    // Create X-Axis
    let xAxis = chart.xAxes.push(
      am5xy.CategoryAxis.new(rootChart.current, {
        renderer: am5xy.AxisRendererX.new(rootChart.current, {}),
        categoryField: "category",
      })
    );
    xAxis.data.setAll(data[state.list]);

    // function for making series
    function makeSeries(name, fieldName) {
      var series = chart.series.push(
        am5xy.ColumnSeries.new(rootChart.current, {
          name: name,
          xAxis: xAxis,
          yAxis: yAxis,
          valueYField: fieldName,
          categoryXField: "category",
        })
      );

      // Add Tooltip
      {
        state.isTooltip &&
          series.columns.template.setAll({
            tooltipText: "[bold]{name}[/]\n{category}: {value1}",
            getLabelFillFromSprite: true,
            tooltipX: am5.percent(50),
            tooltipY: am5.percent(-2),
          });
      }

      // Add Tooltip Features
      let tooltip = am5.Tooltip.new(rootChart.current, {
        getFillFromSprite: true,
        getStrokeFromSprite: false,
        autoTextColor: false,
        getLabelFillFromSprite: false,
      });

      tooltip.get("background").setAll({
        stroke: toolTip.strokeColor,
        strokeWidth: toolTip.strokeWidth,
      });

      tooltip.label.setAll({
        fill: toolTip.textColor,
      });

      series.set("tooltip", tooltip);

      // Series Features
      series.columns.template.setAll({
        width: am5.percent(state.seriesWidth),
        strokeWidth: state.strokeWidth,
        cornerRadiusTL: state.cornerRadiusTL,
        cornerRadiusTR: state.cornerRadiusTR,
        stroke: state.strokeColor,
      });

      series.data.setAll(data[state.list]);

      series.bullets.push(function () {
        return am5.Bullet.new(rootChart.current, {
          locationY: 0,
          sprite: am5.Label.new(rootChart.current, {
            fill: rootChart.current.interfaceColors.get("alternativeText"),
            centerY: 0,
            centerX: am5.p50,
            populateText: true,
          }),
        });
      });
    }
    makeSeries("Series1", "value1");
    makeSeries("Series2", "value2");

    // Add zoomX
    {
      state.isZoom &&
        chart.plotContainer.events.on("wheel", function (ev) {
          if (ev.originalEvent.ctrlKey) {
            ev.originalEvent.preventDefault();
            chart.set("wheelX", "panX");
            chart.set("wheelY", "zoomX");
          } else {
            chart.set("wheelX", "none");
            chart.set("wheelY", "none");
          }
        });
    }

    // Add legend
    {
      state.isLegend &&
        chart.children
          .push(am5.Legend.new(rootChart.current, {}))
          .data.setAll(chart.series.values);
    }

    // Add cursor
    {
      state.isCursor &&
        chart.set("cursor", am5xy.XYCursor.new(rootChart.current, {}));
    }

    return chart;
  }

  const incRadiusTR = () => {
    setState((prevState) => ({
      ...prevState,
      cornerRadiusTR: prevState.cornerRadiusTR + 1,
    }));
  };

  const decRadiusTR = () => {
    setState((prevState) => ({
      ...prevState,
      cornerRadiusTR: prevState.cornerRadiusTR - 1,
    }));
  };

  const incRadiusTL = () => {
    setState((prevState) => ({
      ...prevState,
      cornerRadiusTL: prevState.cornerRadiusTL + 1,
    }));
  };

  const decRadiusTL = () => {
    setState((prevState) => ({
      ...prevState,
      cornerRadiusTL: prevState.cornerRadiusTL - 1,
    }));
  };

  return (
    <div className="mainContainer">
      <h1 style={{ textAlign: "center" }}>
        Creates amChart dynamically with React
      </h1>
      <div className="series1-Box">
        <div className="element">
          <p>Stroke color for Series</p>
          <GithubPicker
            color={state.strokeColor}
            onChangeComplete={(color) =>
              setState((preState) => ({ ...preState, strokeColor: color.hex }))
            }
          />
        </div>

        <div className="element">
          <p>Stroke Width for Series</p>
          <select
            onChange={(e) =>
              setState((preState) => ({
                ...preState,
                strokeWidth: e.target.value,
              }))
            }
          >
            <option value={1}>Inc by 1</option>
            <option value={2}>Inc by 2</option>
            <option value={3}>Inc by 3</option>
            <option value={4}>Inc by 4</option>
            <option value={5}>Inc by 5</option>
          </select>
        </div>

        <div className="element">
          <p>Show/Hide Cursor</p>
          <button
            onClick={() =>
              setState((pre) => ({ ...pre, isCursor: !state.isCursor }))
            }
          >
            {state.isCursor ? "Hide" : "Show"}
          </button>
        </div>
        <div className="element">
          <p>Corner RadiusTL for Series</p>
          <input
            value={state.cornerRadiusTL}
            onChange={(e) =>
              setState((pre) => ({ ...pre, cornerRadiusTL: e.target.value }))
            }
          />
          <br />
          <button onClick={incRadiusTL}>+</button>
          <button onClick={decRadiusTL} disabled={state.cornerRadiusTL <= 0}>
            -
          </button>
        </div>
        <div className="element">
          <p>Corner RadiusTR for Series</p>
          <input
            value={state.cornerRadiusTR}
            onChange={(e) =>
              setState((pre) => ({ ...pre, cornerRadiusTR: e.target.value }))
            }
          />
          <br />
          <button onClick={incRadiusTR}>+</button>
          <button onClick={decRadiusTR} disabled={state.cornerRadiusTR <= 0}>
            -
          </button>
        </div>
        <div className="element">
          <p>Show/Hide Legend</p>
          <button
            onClick={() =>
              setState((pre) => ({ ...pre, isLegend: !state.isLegend }))
            }
          >
            {state.isLegend ? "Hide" : "Show"}
          </button>
        </div>
        <div className="element zoom-Effect">
          <p>Check for zoomX</p>
          <input
            type="checkbox"
            onChange={() =>
              setState((pre) => ({ ...pre, isZoom: !state.isZoom }))
            }
          />
        </div>
        <div className="element">
          <p>Show/Hide Tooltip</p>
          <button
            onClick={() =>
              setState((pre) => ({ ...pre, isTooltip: !state.isTooltip }))
            }
          >
            {state.isTooltip ? "Hide" : "Show"}
          </button>
        </div>
      </div>
      <div style={{ width: "100%" }}>
        <div className="floatRight">
          <div className="floatEle">
            <p>Text Color for Tooltip</p>
            <BlockPicker
              color={toolTip.textColor}
              onChangeComplete={(color) =>
                setToolTip((preState) => ({
                  ...preState,
                  textColor: color.hex,
                }))
              }
            />
          </div>
        </div>
        <div
          id="chartdiv"
          style={{
            width: "70%",
            height: "500px",
            alignSelf: "end",
            margin: "auto",
          }}
        ></div>
        <div className="ele">
          <p>Change Tooltip Stroke width</p>
          <select
            onChange={(e) =>
              setToolTip((pre) => ({ ...pre, strokeWidth: e.target.value }))
            }
          >
            <option value={1}>Initial Value</option>
            <option value={2}>Inc by 2</option>
            <option value={3}>Inc by 3</option>
            <option value={4}>Inc by 4</option>
            <option value={5}>Inc by 5</option>
          </select>
        </div>
        <div className="ele">
          <p>Stroke Color for Tooltip</p>
          <TwitterPicker
            color={toolTip.strokeColor}
            onChangeComplete={(color) =>
              setToolTip((preState) => ({
                ...preState,
                strokeColor: color.hex,
              }))
            }
          />
        </div>
      </div>
      <div className="changeData">
        <div className="dataItem">
          <p>Dynamic Data Feature</p>
          <select
            onChange={(e) =>
              setState((pre) => ({ ...pre, list: e.target.value }))
            }
          >
            <option value={"data1"}>Initial DataValue</option>
            <option value={"data2"}>Data2 Value</option>
            <option value={"data3"}>Data3 Value</option>
            <option value={"data4"}>Data4 Value</option>
          </select>
        </div>
        <div className="dataItem">
          <p>Dynamic Width for Series</p>
          <select
            onChange={(e) =>
              setState((pre) => ({ ...pre, seriesWidth: e.target.value }))
            }
          >
            <option value={50}>Initial Width</option>
            <option value={60}>Inc Width by 60</option>
            <option value={70}>Inc Width by 70</option>
            <option value={75}>Inc Width by 75</option>
          </select>
        </div>
      </div>
    </div>
  );
};
export default ChartApp;
