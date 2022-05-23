function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);

    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    console.log(data);
    var samples=data.samples;
    var metadataArray = data.metadata;
    
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var resultSample = samples.filter(sampleObj => sampleObj.id == sample);
    var filteredMetadata = metadataArray.filter(sampleObj => sampleObj.id == sample);
    //  5. Create a variable that holds the first sample in the array.

    var resultForSample = resultSample[0];
    var metadataResult = filteredMetadata[0]
    console.log(resultSample);
    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
        
    var otu_id = resultForSample.otu_ids;
    var otu_label = resultForSample.otu_labels;
    var sample_value = resultForSample.sample_values;


    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var yticks = otu_id.slice(0,10).map(otuId => `OTU ${otuId}`).reverse();
    var xticks = sample_value.slice(0,10).reverse();
    var hoverlabels = otu_label.slice(0,10).reverse();
    var wash_freq = metadataResult.wfreq;

    console.log(yticks);

    // 8. Create the trace for the bar chart. 
    var barData = [{
      type: 'bar',
      orientation: 'h',
      text: hoverlabels,
      y: yticks,
      x: xticks,  
     
      marker: {
        color: 'mediumslateblue',
        opacity: 0.8,}
    } 
    ];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: 'Top 10 Bacteria Cultures Found', 
      titlefont: {"size": 25},
      // paper_bgcolor: '#F0F8FF',
      // plot_bgcolor: '#F0F8FF'
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);

  
// bubble chart
    // 1. Create the trace for the bubble chart.
    var bubbleData = [{
      type: 'bubble',
      x: otu_id,
      y: sample_value,
      text: otu_label,
      // text: ['A<br>size: 40', 'B<br>size: 60', 'C<br>size: 80', 'D<br>size: 100'],
      mode: 'markers',
      //bgcolor: "lightyellow",
      marker: {
        size: sample_value,
        color: otu_id,
        colorscale: 'RdBu',  
      
      
    }
    }];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: 'Bacteria Cultures Per Sample',
      xaxis: {title: "OTU ID"},
      yaxis: {title: "Sample Value"},
      titlefont: {"size": 25},
      hovermode: "closest",
      height: 500,
      //width:500
      
      //paper_bgcolor: 'lightyellow'
      //  plot_bgcolor: '#F0F8FF'
      
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout); 


// gauge chart
    // 4. Create the trace for the gauge chart.
    var gaugeData = [{
      title: {text: "Scrubs per Week", font: {size: 18}},
      type: "indicator",
      mode: "gauge+number",
      value: wash_freq,
      tickmode: 'linear',
      gauge: {
        axis: { range: [null, 10], dtick: 2, tick0: 0 },
        bar: { color: "orange" },  //firebrick, yellow,lightgreen
        bgcolor: "white",
        borderwidth: 2,
        bordercolor: "gray",
        steps: [
          { range: [0, 2], color: "floralwhite"},
          { range: [2, 4], color: "lavender"},
          { range: [4, 6], color: "thistle"},
          { range: [6, 8], color: "mediumslateblue" },
          { range: [8, 10], color: "royalblue" },
        ]},
        
    }];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      title: { text: "Belly Button Washing Frequency"},
      titlefont: {"size": 25},
      width: 450,
      height: 450,
      // plot_bgcolor: '#F0F8FF',
      // paper_bgcolor: '#F0F8FF',
    };

    Plotly.newPlot('gauge', gaugeData, gaugeLayout);
});

}