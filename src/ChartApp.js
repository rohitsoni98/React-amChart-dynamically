import React, { useEffect, useRef, useState } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import data from "./Data";
import { GithubPicker } from "react-color";

const ChartApp = () => {
  let rootChart = useRef();
  let firstRender = useRef(true);

  const [state, setState] = useState({
    strokeColor: "gray",
    fillColor: "darkGray",
    strokeWidth: 1,
    cornerRadiusTL: 0,
    cornerRadiusTR: 0,
    isCursor: false,
    isLegend: false,
    isZoom: false,
    isTooltip: false,
    list: "data1",
  });

  console.log(state.list);

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
  }, [state]);
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

    let series1 = chart.series.push(
      am5xy.ColumnSeries.new(rootChart.current, {
        name: "Series1",
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: "value1",
        categoryXField: "category",
      })
    );

    let series2 = chart.series.push(
      am5xy.ColumnSeries.new(rootChart.current, {
        name: "Series2",
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: "value2",
        categoryXField: "category",
      })
    );

    series1.data.setAll(data[state.list]);
    series2.data.setAll(data[state.list]);

    series1.columns.template.setAll({
      fill: state.fillColor,
      strokeWidth: state.strokeWidth,
      stroke: state.strokeColor,
      cornerRadiusTL: state.cornerRadiusTL,
      cornerRadiusTR: state.cornerRadiusTR,
    });

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

    // Add Tooltip
    {
      state.isTooltip &&
        series1.columns.template.setAll({
          tooltipText: "[bold]{category} : {value1}",
          tooltipX: am5.percent(50),
          tooltipY: am5.percent(-5),
        });
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
          <p>Stroke color for s1</p>
          <GithubPicker
            color={state.strokeColor}
            onChangeComplete={(color) =>
              setState((preState) => ({ ...preState, strokeColor: color.hex }))
            }
          />
        </div>

        <div className="element">
          <p>Fill color for s1</p>
          <GithubPicker
            color={state.fillColor}
            onChangeComplete={(color) =>
              setState((preState) => ({ ...preState, fillColor: color.hex }))
            }
          />
        </div>

        <div className="element">
          <p>Stroke Width for s1</p>
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
          <p>Corner RadiusTL for s1</p>
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
          <p>Corner RadiusTR for s1</p>
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
      <div
        id="chartdiv"
        style={{ width: "100%", height: "500px", alignSelf: "end" }}
      ></div>
      <div className="changeData">
        <div className="dataItem">
          <p>Dynamic Data Feature</p>
          <select
            onChange={(e) =>
              setState((pre) => ({ ...pre, list: e.target.value }))
            }
          >
            <option value={"data1"}>Initial Value</option>
            <option value={"data2"}>Data 2</option>
            <option value={"data3"}>Data 3</option>
            <option value={"data4"}>Data 4</option>
          </select>
        </div>
      </div>
    </div>
  );
};
export default ChartApp;
