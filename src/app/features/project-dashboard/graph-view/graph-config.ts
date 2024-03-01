export const options  = {
  // configure: {
  //   enabled: true
  // },
  layout: {
    hierarchical: {
      randomSeed: 5,
      enabled: true,
      direction: 'UD', // 'UD' for Up-Down, 'LR' for Left-Right
      sortMethod: 'directed', // 'directed' for Directed, 'hubsize' for Hub size
      levelSeparation: 500,
      nodeSpacing: 300,
      shakeTowards: 'roots',
      parentCentralization: true
    },
  },
  manipulation: {
    addNode: true
  },

  interaction: {
    hover: true,
    dragNodes: true,
    dragView: true,
    zoomView: true,
    multiselect: true,
    // navigationButtons: true,
  },
  physics: {
    enabled: false,
  },
  edges: {
    arrows:{
      to: true
    },
    color:{
      color: '#000000',
      highlight: '#ffffff',
      hover: '#ffffff',
      inherit: 'from',
      opacity: 1.0
    },
    smooth: {
      enabled: true,
      type: 'continuous',
      roundness: 0.5
    },
  },
  nodes: {
    shape: 'box',
    widthConstraint: {
      minimum: 200,
      maximum: 300,
    },
    heightConstraint: {
      minimum: 100,
    },
    font: {
      size: 25,
      face: 'Arial',
      color: '#000000',
    },
    color: {
      border: '#000000', // Optional: Change border color to white for better contrast
      background: '#ec2c2c', // Optional: Adjust node background for better visibility on black
    }
  },
};
