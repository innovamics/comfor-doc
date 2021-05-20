// Chart to define the amplitude example
const CHART_AMP_TAB = document.getElementById("Amplitude");

// BC with amplitude
const CHART_BC_AMP = document.getElementById("BCAmplitude");

// Load with amplitude
const CHART_LOAD_AMP = document.getElementById("LoadAmplitude");

// Nodes
const CHART_NODE_TRI = document.getElementById("NodeTri");

// elements
const CHART_ELEMENT_TRI = document.getElementById("ElementTri");


if (CHART_AMP_TAB != null) {
  let chart_amp_tab = new Chart(CHART_AMP_TAB, {
    type: "line",
    data: {
      labels: ["0", "1", "5", "6", "7"],
      datasets: [
        {
          label: "Palier amplitude",
          fill: false,
          lineTension: 0.1,
          borderColor: "rgb(52,49,49)",
          data: [0, 1, 1, 0, 0],
        },
        {
          label: "Increase amplitude",
          fill: false,
          lineTension: 0.1,
          borderColor: "rgb(48,128,185)",
          data: [
            { x: "0", y: 0 },
            { x: "7", y: 1 },
          ],
        },
        {
          label: "Decrease amplitude",
          fill: false,
          lineTension: 0.1,
          borderColor: "rgb(201,201,201)",
          data: [
            { x: "0", y: 1 },
            { x: "7", y: 0 },
          ],
        },
      ],
    },
    options: {
      scales: {
        x: {
          title: {
            display: true,
            text: "Time [s]",
          },
        },
        y: {
          title: {
            display: true,
            text: "Amplitude",
          },
        },
      },
    },
  });
}

if (CHART_BC_AMP != null) {
  let chart_bc_amp = new Chart(CHART_BC_AMP, {
    type: "line",
    data: {
      labels: ["0", "1", "5", "6", "7"],
      datasets: [
        {
          label: "Increase amplitude",
          fill: false,
          lineTension: 0.1,
          borderColor: "rgb(48,128,185)",
          data: [
            { x: "0", y: 0 },
            { x: "7", y: 2.5 },
          ],
        },
      ],
    },
    options: {
      scales: {
        x: {
          title: {
            display: true,
            text: "Time [s]",
          },
        },
        y: {
          title: {
            display: true,
            text: "Vx",
          },
        },
      },
    },
  });
}

if (CHART_LOAD_AMP != null) {
  let chart_load_amp = new Chart(CHART_LOAD_AMP, {
    type: "line",
    data: {
      labels: ["0", "1", "5", "6", "7"],
      datasets: [
        {
          label: "Vacuum",
          fill: false,
          lineTension: 0.1,
          borderColor: "rgb(48,128,185)",
          data: [
            { x: "0", y: 0.0 },
            { x: "7", y: -1.0 },
          ],
        },
      ],
    },
    options: {
      scales: {
        x: {
          title: {
            display: true,
            text: "Time [s]",
          },
        },
        y: {
          title: {
            display: true,
            text: "Pressure",
          },
        },
      },
    },
  });
}

if (CHART_NODE_TRI != null) {
  let chart_node_tri = new Chart(CHART_NODE_TRI, {
    type: "scatter",
    data: {
      datasets: [
        {
          label: "Node with imposed Load",
          fill: false,
          lineTension: 0.1,
          borderColor: "Black",
          data: [{ x: 5, y: 8 }],
        },
        {
          label: "Nodes with imposed BC",
          fill: false,
          lineTension: 0.1,
          borderColor: "Red",
          data: [
            { x: 3, y: 2 },
            { x: 7, y: 2 },
          ],
        },
      ],
    },
    options: {
      scales: {
        x: {
          title: {
            display: true,
            text: "X",
          },
          min: 1,
          max: 9,
        },
        y: {
          title: {
            display: true,
            text: "Y",
          },
          min: 0,
          max: 10,
        },
      },
    },
  });
}

if (CHART_ELEMENT_TRI != null) {
  let chart_element_tri = new Chart(CHART_ELEMENT_TRI, {
    type: "scatter",
    data: {
      datasets: [
        {
          label: "Membrane element",
          borderColor: "black",
          showLine: true,
          data: [
            { x: 3, y: 2 },
            { x: 5, y: 8 },
            { x: 7, y: 2 },
            { x: 3, y: 2 },
          ],
        },
      ],
    },
    options: {
      scales: {
        x: {
          title: {
            display: true,
            text: "X",
          },
          min: 1,
          max: 9,
        },
        y: {
          title: {
            display: true,
            text: "Y",
          },
          min: 0,
          max: 10,
        },
      },
    },
  });
}