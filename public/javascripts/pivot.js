
load_protocol_data();



setInterval(function(){ load_protocol_data(); }, 300000);



function load_protocol_data(temp=null) {
      swal.fire({
            title:"",
            text:"Retrieving Data From Server ... ",
            showConfirmButton:false,
            allowOutsideClick:false,
            onBeforeOpen: () => {
                Swal.showLoading()
            }
      });

      var config = localStorage.getItem('pivotdatakey');

      if(temp!=null){
          config = temp;
      }

      $.get(`/api/get_point_data`).done(function (res) {
          let dt = [];
          res.forEach((v) => {
            //   console.log(v.data)
              dt.push({
                  "First Name": v.data.First_name,
                  "Last Name": v.data.Last_name,
                  "Height": v.data.Tinggi_Badan,
                  "School": v.data.Asal_Sekolah,
                  "Age": v.data.Umur,
                  "Weight": v.data.Berat_Badan
              })
          })
        //   console.log(dt);
          analytic_protocol_data(dt, config);
          swal.close();
      })
    //   $.getJSON("/data/data.json", function(data) {
    //       analytic_protocol_data(data, config);
    //       swal.close();
    //   });

}



function analytic_protocol_data(data, config){
    var derivers = $.pivotUtilities.derivers;

    var renderers = $.extend(
        $.pivotUtilities.renderers,
        $.pivotUtilities.c3_renderers,
        $.pivotUtilities.d3_renderers,
        $.pivotUtilities.export_renderers
    );

    var rawdata = data;


    var AN ='Count';
    var ASUA = false;
    var C = [];
    var R = [];
    var Exc = {} ;
    var HA = [];
    var IN = {};
    var INI = {};
    var RN = 'Table';
    var UAV = 85;
    var VAL = [];


    if (config) { // If a saved state found in LocalStorage, then load it
          var config_template = $.parseJSON(config); // Make it an object

          AN = config_template.aggregatorName;
          ASUA = config_template.autoSortUnusedAttrs;
          C = config_template.cols;
          R = config_template.rows;
          Exc = config_template.exclusions;
          HA = config_template.hiddenAttributes;
          IN = config_template.inclusions;
          INI = config_template.inclusionsInfo;
          RN = config_template.rendererName;
          UAV = config_template.unusedAttrsVertical;
          VAL = config_template.vals;

          config_template.onRefresh = saveState; // Add callback function for onRefresh

          $(".pivotContainer").pivotUI( // Load with saved state
                rawdata, {
                  autoSortUnusedAttrs: ASUA,
                  cols : C,
                  exclusions : Exc,
                  hiddenAttributes : HA,
                  inclusions: IN,
                  inclusionsInfo : INI,
                  menuLimit :10000,
                  rendererName : RN,
                  rows: R,
                  unusedAttrsVertical : UAV,
                  aggregatorName:AN,
                  vals : VAL,
                  onRefresh: function(config) {
                      saveState(config)
                  }
                },true);
      }
      else{
        $(".pivotContainer").pivotUI(rawdata,{
              renderers: renderers,
              onRefresh: saveState
          });
      }

}





function saveState(config) {
    var config_copy = JSON.parse(JSON.stringify(config));
    //delete some values which are functions
    delete config_copy["aggregators"];
    delete config_copy["renderers"];
    //delete some bulky default values
    delete config_copy["rendererOptions"];
    delete config_copy["localeStrings"];
    localStorage.setItem('pivotdatakey', JSON.stringify(config_copy, undefined, 2));
}

function capitalize_Words(str){
    if(str == null){
        return '';
    }else{
        return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
    }
}
