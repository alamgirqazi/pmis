// const assetsController = {};
// // const Assets = require('../models/assets.model');
// const fs = require('fs');
// var csv = require('csvtojson');
// var moment = require('moment');

// assetsController.getNextId = async (req, res) => {
//   try {
//     let { AssetCategory } = req.query;

//     const max_result = await Assets.aggregate([
//       { $group: { _id: null, max: { $max: { $toInt: '$Id' } } } }
//     ]);

//     let nextId;
//     if (max_result.length > 0) {
//       nextId = max_result[0].max + 1;
//     } else {
//       nextId = 1;
//     }
//     const assets = await Assets.find({});
//     if (AssetCategory.trim() == 'Furniture') {
//       AssetCategory = 'Furniture & Fixture';
//     }
//     if (AssetCategory.trim() == 'Audio') {
//       AssetCategory = 'Audio & Visual Equipment';
//     }

//     const code =
//       returnPrefix(AssetCategory) + (returnFinalMax(assets, AssetCategory) + 1);
//     var data = {
//       code: 200,
//       data: { Id: nextId, AssetCode: code }
//     };
//     res.status(200).send(data);
//   } catch (error) {
//     console.log('error', error);
//     return res.status(500).send(error);
//   }
// };

// assetsController.getAll = async (req, res) => {
//   let assets;
//   try {
//     let {
//       start,
//       length,
//       search,
//       search_query,
//       maxlength,
//       dateEndFormatted,
//       location_filter,
//       disposed_filter,
//       category_filter
//     } = req.query;
//     // const {
//     //     value
//     // } = JSON.parse(search)

//     // if (value != '') {

//     //     obj = {
//     //         $text: {
//     //             $search: value
//     //         },
//     //     }
//     // }

//     let disposed_obj = {};
//     let Location_obj = {};
//     let search_query_obj = {};
//     let assets_before_obj = {};
//     let category_obj = {};
//     if (disposed_filter != '') {
//       disposed_obj = { IS_DISPOSED: disposed_filter };
//     }
//     if (search_query != 'undefined') {
//       const parsed = JSON.parse(search_query);
//       const key = Object.keys(parsed)[0];
//       const value = parsed[Object.keys(parsed)[0]];

//       if (key == 'PurchaseDate') {
//         const todayDate = new Date(value);

//         var tomorrow = new Date(value);
//         tomorrow.setDate(tomorrow.getDate() + 1);
//         search_query_obj = {
//           PurchaseDate:
//             // {$gte: new Date(value)}
//             { $gte: new Date(todayDate), $lt: new Date(tomorrow) }
//         };
//       } else {
//         search_query_obj['' + key] = new RegExp(value.toString(), 'i');
//       }
//     }
//     if (location_filter != '') {
//       Location_obj = {
//         Location: location_filter
//       };
//     }
//     if (category_filter != '') {
//       category_obj = {
//         AssetCategory: category_filter
//       };
//     }

//     if (dateEndFormatted && dateEndFormatted != 'undefined') {
//       assets_before_obj = {
//         PurchaseDate:
//           // {$gte: new Date(value)}
//           { $lt: new Date(dateEndFormatted) }
//         // { $gte: new Date(todayDate), $lt: new Date(dateEndFormatted) }
//       };
//     }

//     // if (id_query != '') {
//     //     id_search_obj = {

//     //         // Id: id_query,
//     //         Id: new RegExp(id_query, 'i')

//     //     }

//     // }
//     // if (assetcode_query != '' ) {
//     //     assetcode_obj = {

//     //         AssetCode: new RegExp(assetcode_query, 'i')
//     //         // AssetCode: assetcode_query
//     //     }

//     // }
//     let merged = {
//       ...assets_before_obj,
//       ...disposed_obj,
//       ...Location_obj,
//       ...search_query_obj,
//       ...category_obj
//     };

//     if (maxlength) {
//       length = parseInt(maxlength);
//     }
//     assets = await Assets.paginate(merged, {
//       offset: parseInt(start),
//       limit: parseInt(length)
//     });
//     res.status(200).send({
//       code: 200,
//       message: 'Successful',
//       data: assets
//     });
//   } catch (error) {
//     console.log('error', error);
//     return res.status(500).send(error);
//   }
// };
// assetsController.getEverything = async (req, res) => {
//   let assets;
//   let final_diff = 0;
//   let { only_stats, dateEndFormatted, dateStartFormatted } = req.query;

//   try {
//     // let disposed_obj = {};
//     // let Location_obj = {};
//     // let category_obj = {};

//     //   if (location_filter != ''  && typeof(location_filter) !== 'undefined') {
//     //     Location_obj = {

//     //         Location: location_filter
//     //     }

//     // }
//     //   if (category_filter != ''  && typeof(category_filter) !== 'undefined') {

//     //   category_obj = {

//     //         AssetCategory: category_filter
//     //     }

//     // }
//     //     if (disposed_filter != ''  && typeof(disposed_filter) !== 'undefined') {

//     //     disposed_obj = {IS_DISPOSED: disposed_filter }
//     // }
//     let categories = [];

//     if (dateEndFormatted && dateEndFormatted != 'undefined') {
//       assets_before_obj = {
//         PurchaseDate:
//           // {$gte: new Date(value)}
//           { $lt: new Date(dateEndFormatted) }
//         // { $gte: new Date(todayDate), $lt: new Date(dateEndFormatted) }
//       };
//     }
//     // let merged = {...disposed_obj, ...Location_obj,...category_obj};
//     assets = await Assets.find(assets_before_obj);
//     //Filter Computer equipment category

//     //Filter Furniture & Fixture category
//     categories.push(
//       assets.filter(value => {
//         return value['AssetCategory'] == 'Furniture & Fixture';
//       })
//     );

//     categories.push(
//       assets.filter(value => {
//         return value['AssetCategory'] == 'Computer Equipment';
//       })
//     );

//     //Filter Office equipment category
//     categories.push(
//       assets.filter(value => {
//         return value['AssetCategory'] == 'Office Equipment';
//       })
//     );
//     //Filter Audio & Visual Equipment category
//     categories.push(
//       assets.filter(value => {
//         return value['AssetCategory'] == 'Audio & Visual Equipment';
//       })
//     );

//     //Filter Vehicles category
//     categories.push(
//       assets.filter(value => {
//         return value['AssetCategory'] == 'Vehicles';
//       })
//     );
//     //Filter Supplies category
//     categories.push(
//       assets.filter(value => {
//         return value['AssetCategory'] == 'Land';
//       })
//     );
//     categories.push(
//       assets.filter(value => {
//         return value['AssetCategory'] == 'Building';
//       })
//     );
//     categories.push(
//       assets.filter(value => {
//         return value['AssetCategory'] == 'Supplies';
//       })
//     );
//     let stats = {};
//     let statsArray = [];
//     for (const category of categories) {
//       let final_total_costs = 0;
//       let final_total_costs_additions = 0;
//       let final_total_costs_disposals = 0;
//       let final_total_costs_accumulated_dep_disposals = 0;
//       let final_total_dep_chargedfortheperiod = 0;
//       let final_total_costs_accumulated_dep_end = 0;
//       let final_total_costs_end = 0;
//       let final_total_gain_loss_value = 0;
//       let final_total_wdv = 0;
//       let final_total_accumulated_dep = 0;
//       let final_DisposalDepreciation = 0;
//       let final_total_disposal_costs = 0;
//       let final_ClosingDepreciation = 0;
//       let final_WrittenDownValue = 0;
//       let final_SaleProceed = 0;
//       let final_AccumulatedDepreciation = 0;
//       let final_CostForThePeriod = 0;
//       let no_of_assets = 0;
//       let total_DisposedStartRangeNumber = 0;
//       let total_DisposedEndRangeNumber = 0;
//       let final_StartWrittenDownValue = 0;
//       let final_EndWrittenDownValue = 0;
//       let final_GainLossValue = 0;
//       let final_StartClosingDepreciation = 0;
//       let final_EndClosingDepreciation = 0;
//       for (const element of category) {
//         no_of_assets++;
 
//         element.UsagePeriod = calcDateDiff2(
//           Date.parse(element.PurchaseDate),
//           Date.parse(dateEndFormatted)
//         );
//         delete element.is_deleted;
//         delete element._id;
//         delete element.__v;

//         if (element.CostForThePeriod == undefined) {
//           element.CostForThePeriod = 0;
//         }
//         if (element.OpeningCost == undefined) {
//           element.OpeningCost = 0;
//         }
//         element.TotalCost =
//           parseFloat(element.CostForThePeriod) +
//           parseFloat(element.OpeningCost);

//         // const { years, months, days } = this.calcDateDiffObj(
//         //   Date.parse(element.PurchaseDate)
//         // );
//         let total_months = 0,
//           total_months_start = 0,
//           total_months_end = 0;
//         //  NORMAL

//         //   element.PurchaseDate = moment(element.PurchaseDate).format(
//         //     'YYYY-MM-DD'
//         //   ); // "Invalid date"

//         total_months = returnMonthsDifference(element.PurchaseDate, Date.now());

//         const lastday = new Date(
//           new Date(Date.now()).getFullYear(),
//           new Date(Date.now()).getMonth() + 1,
//           0
//         ).getDate();

//         const todaydate = Date.now();
//         const day = moment(new Date(Date.now())).date();
//         if (day === lastday) {
//           total_months++;
//           if (element.IS_DISPOSED === 1) {
//             if (
//               moment(todaydate).format('YYYY-MM-DD') ==
//               moment(element.DisposalDate).format('YYYY-MM-DD')
//             ) {
//               total_months--;
//             }
//           }
//         }

//         ///////////////////////////////////

//         if (dateStartFormatted && dateEndFormatted) {
//           element['ClosingDepreciation'] =
//             ((total_months / 12) *
//               parseFloat(element['TotalCost']) *
//               element['DepreciationRate']) /
//             100;

//           total_months_start = returnMonthsDifference(
//             element.PurchaseDate,
//             dateStartFormatted
//           );

//           const lastday_start = new Date(
//             new Date(dateStartFormatted).getFullYear(),
//             new Date(dateStartFormatted).getMonth() + 1,
//             0
//           ).getDate();

//           const day_start = moment(new Date(dateStartFormatted)).date();
//           if (day_start === lastday_start) {
//             total_months_start++;
//             if (element.IS_DISPOSED === 1) {
//               if (
//                 dateStartFormatted ==
//                 moment(element.DisposalDate).format('YYYY-MM-DD')
//               ) {
//                 total_months_start--;
//               }
//             }
//           }

//           //////////////////////////////////////////////////

//           total_months_end = returnMonthsDifference(
//             element.PurchaseDate,
//             dateEndFormatted
//           );

//           const lastday_end = new Date(
//             new Date(dateEndFormatted).getFullYear(),
//             new Date(dateEndFormatted).getMonth() + 1,
//             0
//           ).getDate();

//           const day_end = moment(new Date(dateEndFormatted)).date();
//           if (day_end === lastday_end) {
//             total_months_end++;
//             if (element.IS_DISPOSED === 1) {
//               if (
//                 dateEndFormatted ==
//                 moment(element.DisposalDate).format('YYYY-MM-DD')
//               ) {
//                 total_months_end--;
//               }
//             }
//           }

//           // if (isLater(element.DisposalDate, dateStartFormatted)) {
//           //   total_DisposedStartRangeNumber++;

//           // }
//           // if (isLater(element.DisposalDate, dateEndFormatted)) {
//           //   total_DisposedStartRangeNumber++
//           // }
//         }
//         ////////////////////////////////////////////

//         element['ClosingDepreciation'] =
//           ((total_months / 12) *
//             parseFloat(element['TotalCost']) *
//             element['DepreciationRate']) /
//           100;

//         // new added ////////////////////////////////////
//         element['StartClosingDepreciation'] =
//           ((total_months_start / 12) *
//             parseFloat(element['TotalCost']) *
//             element['DepreciationRate']) /
//           100;
//         element['EndClosingDepreciation'] =
//           ((total_months_end / 12) *
//             parseFloat(element['TotalCost']) *
//             element['DepreciationRate']) /
//           100;

//         ////////////////////////////////////////////
//         if (total_months >= 12) {
//           element.DepreciationChargedForThePeriod =
//             (1 *
//               parseFloat(element['TotalCost']) *
//               element['DepreciationRate']) /
//             100;

//           if (element['ClosingDepreciation'] >= element['TotalCost']) {
//             // depreciation complete

//             element['ClosingDepreciation'] = element['TotalCost'];

//             //////////////// new added
//             if (element['StartClosingDepreciation'] >= element['OpeningCost']) {
//               element['StartClosingDepreciation'] = element['OpeningCost'];
//             }
//             if (element['EndClosingDepreciation'] >= element['OpeningCost']) {
//               element['EndClosingDepreciation'] = element['OpeningCost'];
//             }

//             element['AccumulatedDepreciation'] = element['OpeningCost'];
//           }
//         } else {
//           // element.ClosingDepreciation = 0;

//           element.DepreciationChargedForThePeriod =
//             ((total_months / 12) *
//               parseFloat(element['TotalCost']) *
//               element['DepreciationRate']) /
//             100;
//         }

//         element.WrittenDownValue =
//           parseFloat(element.TotalCost) - element.ClosingDepreciation;

//         ///////////////////////////
//         element['StartWrittenDownValue'] =
//           parseFloat(element.TotalCost) - element.StartClosingDepreciation;
//         element['EndWrittenDownValue'] =
//           parseFloat(element.TotalCost) - element.EndClosingDepreciation;

//         ////////////////////////////////////////////////////

//         if (element['ClosingDepreciation'] >= element['TotalCost']) {
//           element.WrittenDownValue = 1;
//           element.DepreciationChargedForThePeriod = 0;
//         }

//         //////////////////////////////// start
//         if (element['StartClosingDepreciation'] >= element['TotalCost']) {
//           element.StartWrittenDownValue = 1;
//         }
//         if (element['EndClosingDepreciation'] >= element['TotalCost']) {
//           element.EndWrittenDownValue = 1;
//         }

//         //////////////////////////////////////////

//         if (total_months >= 12) {
//           element.AccumulatedDepreciation =
//             element.ClosingDepreciation -
//             element.DepreciationChargedForThePeriod;
//         } else {
//           element.AccumulatedDepreciation = 0;
//         }

//         if (
//           element['SaleProceed'] &&
//           typeof Number(element['SaleProceed']) == 'number'
//         ) {
//           if (element['WrittenDownValue'] == '1') {
//             element.GainLossValue = element['SaleProceed'];
//           } else {
//             element.GainLossValue =
//               element['SaleProceed'] - element['WrittenDownValue'];
//           }
//         }
//         if (
//           isLater(element.DisposalDate, dateStartFormatted) &&
//           element.IS_DISPOSED === 1
//         ) {
//           element.DisposedStartRangeStatus = 'Disposed';
//           element.StartClosingDepreciation = 0;
//           element.StartWrittenDownValue = 0;
//           total_DisposedStartRangeNumber++;
//         } else {
//           element.DisposedStartRangeStatus = 'Not Disposed';
//         }

//         if (
//           isLater(element.DisposalDate, dateEndFormatted) &&
//           element.IS_DISPOSED === 1
//         ) {
//           element.EndClosingDepreciation = 0;
//           element.EndWrittenDownValue = 0;

//           element.DisposedEndRangeStatus = 'Disposed';
//           total_DisposedEndRangeNumber++;
//         } else {
//           element.DisposedEndRangeStatus = 'Not Disposed';
//         }
//         if (element.GainLossValue && element.IS_DISPOSED === 1) {
//           element['DisposalCost'] = element['TotalCost'];
//           element['TotalCost'] = 0;
//           element['WrittenDownValue'] = 0;
//           // element['DisposalDepreciation'] = element['ClosingDepreciation'];

//           element['ClosingDepreciation'] = 0;

//           // heavy logics

//           let total_months_disposal = returnMonthsDifference(
//             element.PurchaseDate,
//             element.DisposalDate
//           );
//           const lastday_end_disposal = new Date(
//             new Date(element.DisposalDate).getFullYear(),
//             new Date(element.DisposalDate).getMonth() + 1,
//             0
//           ).getDate();

//           const day_end_disposal = moment(
//             new Date(element.DisposalDate)
//           ).date();
//           if (day_end_disposal === lastday_end_disposal) {
//             // total_months_disposal++;
//             if (element.IS_DISPOSED === 1) {
//               if (
//                 moment(element.DisposalDate).format('YYYY-MM-DD') ==
//                 moment(element.PurchaseDate).format('YYYY-MM-DD')
//               ) {
//                 total_months_disposal--;
//               }
//             }
//           }

//           // if (total_months_disposal > 12) {
//           //   element['DisposalDepreciation'] =
//           //     (1 *
//           //       parseFloat(element['DisposalCost']) *
//           //       element['DepreciationRate']) /
//           //     100;
//           // } else {
//           element['DisposalDepreciation'] =
//             ((total_months_disposal / 12) *
//               parseFloat(element['DisposalCost']) *
//               element['DepreciationRate']) /
//             100;
//           }
//         let purchase_disp_difference = returnMonthsDifference(
//           element.PurchaseDate,
//           element.DisposalDate,

//         );
//         if (
//           element.IS_DISPOSED === 1 &&
//           isLater(dateStartFormatted, element.DisposalDate) &&
//           isLater(element.DisposalDate, dateEndFormatted)
//         ) {
//           total_months_end = returnMonthsDifference(
//             element.DisposalDate,
//             dateEndFormatted
//           );
       
         
//           if(purchase_disp_difference>12){

//             if(total_months_end>12)
//          {   purchase_disp_difference=   total_months_end;  
//          }
//          else{
//           purchase_disp_difference = 12 - total_months_end - 1;

//          }
         
//           }
//           else{
//             // purchase_disp_difference = 12 - total_months_end - 1;
//         }
//         }
//         if (purchase_disp_difference >= 12) {
//           element.DepreciationChargedForThePeriodEnd =
//             (1 *
//               parseFloat(element['TotalCost']) *
//               element['DepreciationRate']) /
//             100;

//           if (
//             element.IS_DISPOSED === 1 &&
//             parseFloat(element['TotalCost']) == 0
//           ) {
//             element.DepreciationChargedForThePeriodEnd =
//               (1 *
//                 parseFloat(element['DisposalCost']) *
//                 element['DepreciationRate']) /
//               100;
//           }
//         } else {
         

//           element.DepreciationChargedForThePeriodEnd =
//             ((purchase_disp_difference / 12) *
//               parseFloat(element['TotalCost']) *
//               element['DepreciationRate']) /
//             100;

//           if (
//             element.IS_DISPOSED === 1 &&
//             parseFloat(element['TotalCost']) == 0
//           ) {
//             element.DepreciationChargedForThePeriodEnd =
//               ((purchase_disp_difference / 12) *
//                 parseFloat(element['DisposalCost']) *
//                 element['DepreciationRate']) /
//               100;
//           }

//         }

//         if (
//           element['ClosingDepreciation'] > element['TotalCost'] &&
//           element.IS_DISPOSED === 1
//           // ||
//           // element['ClosingDepreciation'] >= element['DisposalCost']
//         ) {
//           element.DepreciationChargedForThePeriodEnd = 0;
//           // some heavy shit
//           const months = returnMonths(element.DepreciationRate);

//           if (total_months_end > months && total_months_end - 12 <= months) {
//             const temp = total_months_end - 12;
//             const final_months = months - temp;

//             element.DepreciationChargedForThePeriodEnd =
//               ((final_months / 12) *
//                 parseFloat(element['TotalCost']) *
//                 element['DepreciationRate']) /
//               100;
//             }

//           // if (
//           //   element.IS_DISPOSED === 1 &&
//           //   isLater(dateStartFormatted, element.DisposalDate) &&
//           //   isLater(element.DisposalDate, dateEndFormatted)
//           // ) {
//           //   if (total_months_start >= 12) {
//           //     element.DisposalDep =
//           //       (1 *
//           //         parseFloat(element['DisposalCost']) *
//           //         element['DepreciationRate']) /
//           //       100;
//           //   } else {
//           //     element.DisposalDep =
//           //       ((total_months_start / 12) *
//           //         parseFloat(element['DisposalCost']) *
//           //         element['DepreciationRate']) /
//           //       100;
//           //   }
//           // }
//         }

//         if (
//           element.IS_DISPOSED === 0
//           // ||
//           // element['ClosingDepreciation'] >= element['DisposalCost']
//         ) {
//           // some heavy shit

//           const months = returnMonths(element.DepreciationRate);

//           if (
//             total_months_end > months &&
//             total_months_end - 12 <= months
//           ) {
//             const temp = total_months_end - 12;
//             const final_months = months - temp;

//             element.DepreciationChargedForThePeriodEnd =
//               ((final_months / 12) *
//                 parseFloat(element['TotalCost']) *
//                 element['DepreciationRate']) /
//               100;
           
//           } else {
//             if (total_months_end >= 12) {
//               element.DepreciationChargedForThePeriodEnd =
//                 (1 *
//                   parseFloat(element['TotalCost']) *
//                   element['DepreciationRate']) /
//                 100;
//             } else {
//               element.DepreciationChargedForThePeriodEnd =
//                 ((total_months_end / 12) *
//                   parseFloat(element['TotalCost']) *
//                   element['DepreciationRate']) /
//                 100;
//             }
//           }
//         }


//         if (
//           element['ClosingDepreciation'] >= element['TotalCost'] &&
//           element.IS_DISPOSED === 0
//           // ||
//           // element['ClosingDepreciation'] >= element['DisposalCost']
//         ) {
//           element.DepreciationChargedForThePeriodEnd = 0;
//           // some heavy shit
//           const months = returnMonths(element.DepreciationRate);

//           if (total_months_end > months && total_months_end - 12 <= months) {

//             const temp = total_months_end - 12;
//             const final_months = months - temp;

//             element.DepreciationChargedForThePeriodEnd =
//               ((final_months / 12) *
//                 parseFloat(element['TotalCost']) *
//                 element['DepreciationRate']) /
//               100;
//             }

//             else{
//             if (total_months_end > months) {
//               // do nothing
//             } 
//              //THE CHANGE MADE
//                 //THE CHANGE MADE

                
//                 else{
//                   if(total_months_end>12) {
//                   element.DepreciationChargedForThePeriodEnd =
//                     (1 *
//                       parseFloat(element['TotalCost']) *
//                       element['DepreciationRate']) /
//                     100;
//                 }
//                 else{
//                   ((total_months_end/12) *
//                     parseFloat(element['TotalCost']) *
//                     element['DepreciationRate']) /
//                   100;

//                 }
//                 }
//                 }
//             // if (
//           //   element.IS_DISPOSED === 1 &&
//           //   isLater(dateStartFormatted, element.DisposalDate) &&
//           //   isLater(element.DisposalDate, dateEndFormatted)
//           // ) {
//           //   if (total_months_start >= 12) {
//           //     element.DisposalDep =
//           //       (1 *
//           //         parseFloat(element['DisposalCost']) *
//           //         element['DepreciationRate']) /
//           //       100;
//           //   } else {
//           //     element.DisposalDep =
//           //       ((total_months_start / 12) *
//           //         parseFloat(element['DisposalCost']) *
//           //         element['DepreciationRate']) /
//           //       100;
//           //   }
//           // }
//         }

//         // set depreciation 0 if disposed before range

//         if (
//           element.IS_DISPOSED === 1 &&
//           isLater(element.DisposalDate, dateStartFormatted)
//         ) {
//           element.DepreciationChargedForThePeriodEnd = 0;
//         }

// // @Todo: Solution 2 starts here 

// // FINALE CHANGED LOGIC
// if (
//   element['ClosingDepreciation'] >= element['TotalCost'] &&
//   element.IS_DISPOSED === 1
//   // ||
//   // element['ClosingDepreciation'] >= element['DisposalCost']
// ) {
//   const months = returnMonths(element.DepreciationRate);
//                 const months_from_purchase = returnMonthsDifference(
//                   element.PurchaseDate,
//                   dateEndFormatted
//                 );
//                 const monthsfromstart = returnMonthsDifference(
//                   element.PurchaseDate,
//                   dateStartFormatted
//                 );

//                 // now check if disposal date between two dates
//                 if (months_from_purchase > months) {
//                   element.DepreciationChargedForThePeriodEnd = 0;

//                   // add 1 if not disposed during the period
//                   let diff;
//                   if (
//                     isLater(
//                       dateStartFormatted,
//                       element.DisposalDate
//                     ) &&
//                     isLater(element.DisposalDate, dateEndFormatted)
//                     &&
//                   months_from_purchase < months
//                   ) {
//                     // If Disposed between date range then different number of months

//                     const months_from_dispose = returnMonthsDifference(
//                       dateStartFormatted,
//                       element.DisposalDate
//                     );

//                     const months_from_purchase_date = this.returnMonthsDifference(
//                       element.PurchaseDate,
//                       element.DisposalDate
//                     );
//                     if (months_from_purchase_date < months_from_dispose) {
//                       diff = months_from_purchase_date;
//                     } else {
//                       diff = months_from_dispose;
//                     }

//                     element.DepreciationChargedForThePeriodEnd =
//                     ((diff / 12) *
//                       (parseFloat(element['OpeningCost']) +
//                         parseFloat(element['CostForThePeriod'])) *
//                       element['DepreciationRate']) /
//                     100;
//                       if(monthsfromstart > months){
//                         element.DepreciationChargedForThePeriodEnd = 0;
//                       }
               
//                   } else {
//                     const months_from_dispose = returnMonthsDifference(
//                       dateStartFormatted,
//                       element.DisposalDate
//                     );
  
//                     if (months_from_purchase > months) {
//                       diff = months_from_purchase - months + 1;
  
//                       if (diff < months_from_dispose) {
//                         element.DepreciationChargedForThePeriodEnd =
//                           ((diff / 12) *
//                             (parseFloat(element['OpeningCost']) +
//                               parseFloat(element['CostForThePeriod'])) *
//                             element['DepreciationRate']) /
//                           100;
//                         if (monthsfromstart > months) {
//                           element.DepreciationChargedForThePeriodEnd = 0;
//                         }
//                       } else {
//                         element.DepreciationChargedForThePeriodEnd =
//                           ((months_from_dispose / 12) *
//                             (parseFloat(element['OpeningCost']) +
//                               parseFloat(element['CostForThePeriod'])) *
//                             element['DepreciationRate']) /
//                           100;
//                         if (monthsfromstart > months) {
//                           element.DepreciationChargedForThePeriodEnd = 0;
//                         }
//                       }
//                     }
//                   }
//                   if (diff > 0 && diff < 12) {
//                     // element.DepreciationChargedForThePeriodEnd =
//                     //   ((diff / 12) *
//                     //     (parseFloat(element['OpeningCost']) +
//                     //       parseFloat(element['CostForThePeriod'])) *
//                     //     element['DepreciationRate']) /
//                     //   100;
//                   }
//                 }
// }

// //////////////////////////////////// ENDS here 



//         // very experimental
//         if (
//           element['SaleProceed'] &&
//           typeof Number(element['SaleProceed']) == 'number'
//         ) {
//           if (element['WrittenDownValue'] == '1') {
//             // element.GainLossValue = element['SaleProceed'];
//           } else {
//             // calculate total Cost

//             let temp_disposal_dep;
//             if(parseFloat(element.DisposalDepreciation) > (parseFloat(element.OpeningCost) + parseFloat(element.CostForThePeriod)) )
//           {
//              temp_disposal_dep = parseFloat(element.OpeningCost) + parseFloat(element.CostForThePeriod)

//           }

//           else{
//             temp_disposal_dep = parseFloat(element.DisposalDepreciation);
//           }

//             const temp_wdv =
//               parseFloat(element.DisposalCost) -
//               temp_disposal_dep;
//             element.GainLossValue = element['SaleProceed'] - temp_wdv;

//           }
//         }

//         if (
//           element['DisposalDepreciation'] >
//           parseFloat(element['OpeningCost']) +
//             parseFloat(element['CostForThePeriod'])
//         ) {
//           element['DisposalDepreciation'] =
//             parseFloat(element['OpeningCost']) +
//             parseFloat(element['CostForThePeriod']);
//         }
     
//         // if (isLater(element.PurchaseDate, dateStartFormatted)) {
//           if (
//             element.IS_DISPOSED === 1 &&
//             isLater(element.DisposalDate,dateStartFormatted)
//           ){
//           }
//           else{
//                 if (isLater(element.PurchaseDate, dateStartFormatted)) {
//                   final_total_costs =
//                   final_total_costs + parseFloat(element['CostForThePeriod']) +
//                       parseFloat(element['OpeningCost'])
                 
//                 }
               
//           }

//         if (
//           isLater(dateStartFormatted, element.PurchaseDate) &&
//           isLater(element.PurchaseDate, dateEndFormatted)
//         ) {
        
        
//           final_total_costs_additions =
//             final_total_costs_additions +
//             parseFloat(element['CostForThePeriod']) +
//             parseFloat(element['OpeningCost']);
//         }
//         if (
//           isLater(dateStartFormatted, element.DisposalDate) &&
//           isLater(element.DisposalDate, dateEndFormatted)
//         ) {
//           final_total_costs_disposals =
//             final_total_costs_disposals + parseFloat(element['DisposalCost']);
//         }

//           if(element.GainLossValue && element.GainLossValue !='undefined'){

//             if (
//               isLater(dateStartFormatted, element.DisposalDate) &&
//               isLater(element.DisposalDate, dateEndFormatted)
//             ){

//           final_total_gain_loss_value =
//           parseFloat(final_total_gain_loss_value) + parseFloat(element['GainLossValue']);
//         }
//         }
//         final_total_costs_end =
//           final_total_costs +
//           final_total_costs_additions -
//           final_total_costs_disposals;

//         // }

//         // if (element['ClosingDepreciation']) {

//         if (isLater(element.PurchaseDate, dateStartFormatted)) {
//           final_total_accumulated_dep =
//             final_total_accumulated_dep +
//             parseFloat(element['StartClosingDepreciation']);
//         }
//         if (parseFloat(element.DepreciationChargedForThePeriodEnd) < 0) {
//           element.DepreciationChargedForThePeriodEnd = 0;
//         }
//         //  if(parseFloat(element['WrittenDownValue'])!=1){
//         final_total_dep_chargedfortheperiod =
//           final_total_dep_chargedfortheperiod +
//           parseFloat(element['DepreciationChargedForThePeriodEnd']);
//         //
//         //  }

//         if (
//           element.IS_DISPOSED === 1 &&
//           isLater(dateStartFormatted, element.DisposalDate) &&
//           isLater(element.DisposalDate, dateEndFormatted)
//         ) {
//           // let temp;
//           // if (total_months_start >= 12) {
//           // // if (total_months >= 12) {
//           //   temp =   (1 *
//           //   parseFloat(element['DisposalCost']) *
//           //   element['DepreciationRate']) /
//           // 100;

//           // }
//           // else{
//           //   temp =   ((total_months_start / 12) *
//           //   parseFloat(element['DisposalCost']) *
//           //   element['DepreciationRate']) /
//           // 100;

//           // }
//           let temp_disposal_dep_calc = parseFloat(element['DisposalDepreciation'])

//           if(Number.isNaN(temp_disposal_dep_calc)){
//             temp_disposal_dep_calc = 0;
//           }
//           final_total_costs_accumulated_dep_disposals =
//             final_total_costs_accumulated_dep_disposals +
//             temp_disposal_dep_calc;
//         }

//               // check 3 values addition 

//               let temp_disposal_dep = parseFloat(element['DisposalDepreciation'])

//               if(Number.isNaN(temp_disposal_dep)){
//                 temp_disposal_dep = 0;
//               }
        
   
//         const val1 =     parseFloat(element['DepreciationChargedForThePeriodEnd']) +
//         parseFloat(element['StartClosingDepreciation']) -
//         temp_disposal_dep;

//         const val2 =  parseFloat(element['OpeningCost']) +   parseFloat(element['CostForThePeriod'])
//         if(val1 > val2 && element.AssetCategory == 'Computer Equipment' )
// {

//   const diff = val1 - val2;
//   final_diff = final_diff + diff;

// }   

// if(element.AssetCategory == 'Computer Equipment'){
//         final_total_costs_accumulated_dep_end =
//           final_total_dep_chargedfortheperiod +
//           final_total_accumulated_dep -
//           final_total_costs_accumulated_dep_disposals - final_diff;          

// }
// else{
//   final_total_costs_accumulated_dep_end =
//   final_total_dep_chargedfortheperiod +
//   final_total_accumulated_dep -
//   final_total_costs_accumulated_dep_disposals;         
// }
    
//         // }

//         final_total_wdv =
//           final_total_costs_end - final_total_costs_accumulated_dep_end;
//         if (element['DisposalCost']) {
//           final_total_disposal_costs =
//             final_total_costs + parseFloat(element['DisposalCost']);
//         }
//         if (element['DisposalDepreciation']) {
//           final_DisposalDepreciation =
//             final_DisposalDepreciation +
//             parseFloat(element['DisposalDepreciation']);
//         }
//         if (element['ClosingDepreciation']) {
//           final_ClosingDepreciation =
//             final_ClosingDepreciation +
//             parseFloat(element['ClosingDepreciation']);
//         }
//         if (element['WrittenDownValue']) {
//           final_WrittenDownValue =
//             final_WrittenDownValue + parseFloat(element['WrittenDownValue']);
//         }
//         if (element['SaleProceed']) {
//           final_SaleProceed =
//             final_SaleProceed + parseFloat(element['SaleProceed']);
//         }
//         if (element['GainLossValue']) {
//           final_GainLossValue =
//             final_GainLossValue + parseFloat(element['GainLossValue']);
//         }

//         if (element['AccumulatedDepreciation']) {
//           final_AccumulatedDepreciation =
//             final_AccumulatedDepreciation +
//             parseFloat(element['AccumulatedDepreciation']);
//         }
//         if (element['CostForThePeriod']) {
//           final_CostForThePeriod =
//             final_CostForThePeriod + parseFloat(element['CostForThePeriod']);
//         }
//         if (element['EndWrittenDownValue']) {
//           final_EndWrittenDownValue =
//             final_EndWrittenDownValue +
//             parseFloat(element['EndWrittenDownValue']);
//         }
//         if (element['StartWrittenDownValue']) {
//           final_StartWrittenDownValue =
//             final_StartWrittenDownValue +
//             parseFloat(element['StartWrittenDownValue']);
//         }
//         if (element['EndClosingDepreciation']) {
//           final_EndClosingDepreciation =
//             final_EndClosingDepreciation +
//             parseFloat(element['EndClosingDepreciation']);
//         }
//         if (element['StartClosingDepreciation']) {
//           final_StartClosingDepreciation =
//             final_StartClosingDepreciation +
//             parseFloat(element['StartClosingDepreciation']);
//         }
//       }
//       stats = {
//         no_of_assets,
//         final_total_costs,
//         final_total_costs_additions,
//         final_total_costs_disposals,
//         final_total_costs_accumulated_dep_disposals,
//         final_total_costs_end,
//         final_total_gain_loss_value,
//         final_total_accumulated_dep,
//         final_total_dep_chargedfortheperiod,
//         final_total_costs_accumulated_dep_end,
//         final_total_wdv,
//         final_GainLossValue,
//         final_total_disposal_costs,
//         final_AccumulatedDepreciation,
//         final_CostForThePeriod,
//         final_DisposalDepreciation,
//         final_ClosingDepreciation,
//         final_WrittenDownValue,
//         final_SaleProceed,
//         final_StartClosingDepreciation,
//         final_StartClosingDepreciation,
//         total_DisposedStartRangeNumber,
//         final_EndClosingDepreciation,
//         final_StartWrittenDownValue,
//         final_EndWrittenDownValue,
//         total_DisposedEndRangeNumber
//       };

//       statsArray.push(stats);
//     }

//     if (only_stats) {
//       let temp_final_stats = {
//         no_of_assets: 0,
//         final_total_costs: 0,
//         final_total_costs_additions: 0,
//         final_total_costs_disposals: 0,
//         final_total_costs_accumulated_dep_disposals: 0,
//         final_total_costs_end: 0,
//         final_total_gain_loss_value: 0,
//         final_total_accumulated_dep: 0,
//         final_total_dep_chargedfortheperiod: 0,
//         final_total_costs_accumulated_dep_end: 0,
//         final_total_wdv: 0,
//         final_GainLossValue: 0,
//         final_total_disposal_costs: 0,
//         final_AccumulatedDepreciation: 0,
//         final_CostForThePeriod: 0,
//         final_DisposalDepreciation: 0,
//         final_ClosingDepreciation: 0,
//         final_WrittenDownValue: 0,
//         final_SaleProceed: 0,
//         final_StartClosingDepreciation: 0,
//         final_StartClosingDepreciation: 0,
//         total_DisposedStartRangeNumber: 0,
//         final_EndClosingDepreciation: 0,
//         final_StartWrittenDownValue: 0,
//         final_EndWrittenDownValue: 0,
//         total_DisposedEndRangeNumber: 0
//       };

//       const categoriesListing = [
//         {
//           id: 1,
//           name: 'Furniture & Fixture',
//           DepreciationRate: '10'
//         },
//         {
//           id: 2,
//           name: 'Computer Equipment',
//           DepreciationRate: '33.33'
//         },
//         {
//           id: 3,
//           name: 'Office Equipment',
//           DepreciationRate: '20'
//         },
//         {
//           id: 4,
//           name: 'Audio & Visual Equipment',
//           DepreciationRate: '20'
//         },
//         {
//           id: 5,
//           name: 'Vehicles',
//           DepreciationRate: '20'
//         },
//         {
//           id: 6,
//           name: 'Land',
//           DepreciationRate: '0'
//         },
//         {
//           id: 7,
//           name: 'Building',
//           DepreciationRate: '5'
//         },
//         {
//           id: 8,
//           name: 'Supplies',
//           DepreciationRate: '0'
//         }
//       ];

//       for (let i = 0; i < categoriesListing.length; i++) {
//         statsArray[i].category = categoriesListing[i].name;
//         statsArray[i].categoryDepreciationRate =
//           categoriesListing[i].DepreciationRate + '%';
//       }

//       statsArray.forEach(element => {
//         temp_final_stats.category = 'Total';
//         temp_final_stats.no_of_assets =
//           temp_final_stats.no_of_assets + element.no_of_assets;
//         temp_final_stats.final_total_costs =
//           temp_final_stats.final_total_costs + element.final_total_costs;
//         temp_final_stats.final_total_costs_additions =
//           temp_final_stats.final_total_costs_additions +
//           element.final_total_costs_additions;
//         temp_final_stats.final_total_costs_disposals =
//           temp_final_stats.final_total_costs_disposals +
//           element.final_total_costs_disposals;
//         temp_final_stats.final_total_costs_accumulated_dep_disposals =
//           temp_final_stats.final_total_costs_accumulated_dep_disposals +
//           element.final_total_costs_accumulated_dep_disposals;
//         temp_final_stats.final_total_costs_end =
//           temp_final_stats.final_total_costs_end +
//           element.final_total_costs_end;
//         temp_final_stats.final_total_gain_loss_value =
//           temp_final_stats.final_total_gain_loss_value +
//           element.final_total_gain_loss_value;
//         temp_final_stats.final_total_accumulated_dep =
//           temp_final_stats.final_total_accumulated_dep +
//           element.final_total_accumulated_dep;
//         temp_final_stats.final_total_dep_chargedfortheperiod =
//           temp_final_stats.final_total_dep_chargedfortheperiod +
//           element.final_total_dep_chargedfortheperiod;
//         temp_final_stats.final_total_costs_accumulated_dep_end =
//           temp_final_stats.final_total_costs_accumulated_dep_end +
//           element.final_total_costs_accumulated_dep_end;
//         temp_final_stats.final_total_wdv =
//           temp_final_stats.final_total_wdv + element.final_total_wdv;
//         temp_final_stats.final_GainLossValue =
//           temp_final_stats.final_GainLossValue + element.final_GainLossValue;
//         temp_final_stats.final_total_disposal_costs =
//           temp_final_stats.final_total_disposal_costs +
//           element.final_total_disposal_costs;
//         temp_final_stats.final_AccumulatedDepreciation =
//           temp_final_stats.final_AccumulatedDepreciation +
//           element.final_AccumulatedDepreciation;
//         temp_final_stats.final_CostForThePeriod =
//           temp_final_stats.final_CostForThePeriod +
//           element.final_CostForThePeriod;
//         temp_final_stats.final_DisposalDepreciation =
//           temp_final_stats.final_DisposalDepreciation +
//           element.final_DisposalDepreciation;
//         temp_final_stats.final_ClosingDepreciation =
//           temp_final_stats.final_ClosingDepreciation +
//           element.final_ClosingDepreciation;
//         temp_final_stats.final_WrittenDownValue =
//           temp_final_stats.final_WrittenDownValue +
//           element.final_WrittenDownValue;
//         temp_final_stats.final_SaleProceed =
//           temp_final_stats.final_SaleProceed + element.final_SaleProceed;
//         temp_final_stats.final_StartClosingDepreciation =
//           temp_final_stats.final_StartClosingDepreciation +
//           element.final_StartClosingDepreciation;
//         temp_final_stats.total_DisposedStartRangeNumber =
//           temp_final_stats.total_DisposedStartRangeNumber +
//           element.total_DisposedStartRangeNumber;
//         temp_final_stats.final_EndClosingDepreciation =
//           temp_final_stats.final_EndClosingDepreciation +
//           element.final_EndClosingDepreciation;
//         temp_final_stats.final_StartWrittenDownValue =
//           temp_final_stats.final_StartWrittenDownValue +
//           element.final_StartWrittenDownValue;
//         temp_final_stats.total_DisposedEndRangeNumber =
//           temp_final_stats.total_DisposedEndRangeNumber +
//           element.total_DisposedEndRangeNumber;
//       });

//       statsArray.push(temp_final_stats);
//       // push totals

//       let newStats = [];
//       newStats = JSON.parse(JSON.stringify(statsArray));
//       // this will be the final . God forgive me for this

//       newStats.forEach(element => {
//         element['Asset Category'] = element.category;

//         element['Number of Assets'] = element.no_of_assets;

//         element['Costs as at ' + moment(dateStartFormatted).format('DD-MM-YYYY')] = Math.round(
//           element.final_total_costs
//         );

//         element['Additions'] = Math.round(element.final_total_costs_additions);

//         element['(Disposals)'] = Math.round(
//           element.final_total_costs_disposals
//         );

//         element['Costs as at ' + moment(dateEndFormatted).format('DD-MM-YYYY')] = Math.round(
//           element.final_total_costs_end
//         );

//         element['Depreciation Rate'] = element.categoryDepreciationRate;

//         // new test check 

//         element['Dep As at ' + moment(dateStartFormatted).format('DD-MM-YYYY')] = Math.round(
//           element.final_total_accumulated_dep
//         );

//         element['Charged for the Period'] = Math.round(
//           element.final_total_dep_chargedfortheperiod
//         );

//         element['(Dep Disposals)'] = Math.round(
//           element.final_total_costs_accumulated_dep_disposals
//         );

//         element['Dep As at ' +  moment(dateEndFormatted).format('DD-MM-YYYY') ] = Math.round(
//           element.final_total_costs_accumulated_dep_end
//         );

//         element['WDV as at ' +  moment(dateStartFormatted).format('DD-MM-YYYY')] = Math.round(
//           element.final_total_wdv
//         );
//         // element['WDV as at ' + dateStartFormatted] = Math.round(
//         //   element.final_total_wdv
//         // );

//         element['Gain / Loss in the period'] = Math.round(
//           element.final_total_gain_loss_value
//         );
//         element['No of Disposed Assets on ' +  moment(dateStartFormatted).format('DD-MM-YYYY')] =
//           element.total_DisposedStartRangeNumber;
//         element['No of Disposed Assets on ' +  moment(dateEndFormatted).format('DD-MM-YYYY')] =
//           element.total_DisposedEndRangeNumber;

//         delete element.total_DisposedStartRangeNumber;
//         delete element.final_total_costs;
//         delete element.final_total_gain_loss_value;
//         delete element.final_total_wdv;
//         delete element.final_total_costs_accumulated_dep_end;
//         delete element.final_total_costs_end;
//         delete element.total_DisposedEndRangeNumber;
//         delete element.category;
//         delete element.final_total_costs_accumulated_dep_disposals;
//         delete element.no_of_assets;
//         delete element.final_total_accumulated_dep;
//         delete element.final_total_costs_additions;
//         delete element.final_total_costs_disposals;
//         delete element.categoryDepreciationRate;
//         delete element.final_total_dep_chargedfortheperiod;
//         delete element.final_total_costs_end;
//         delete element.final_total_gain_loss_value;
//         delete element.final_total_accumulated_dep;
//         delete element.final_total_dep_chargedfortheperiod;
//         delete element.final_total_costs_accumulated_dep_end;
//         delete element.final_total_wdv;
//         delete element.final_GainLossValue;
//         delete element.final_total_disposal_costs;
//         delete element.final_AccumulatedDepreciation;
//         delete element.final_CostForThePeriod;
//         delete element.final_DisposalDepreciation;
//         delete element.final_ClosingDepreciation;
//         delete element.final_WrittenDownValue;
//         delete element.final_SaleProceed;
//         delete element.final_StartClosingDepreciation;
//         delete element.final_StartClosingDepreciation;
//         delete element.total_DisposedStartRangeNumber;
//         delete element.final_EndClosingDepreciation;
//         delete element.final_StartWrittenDownValue;
//         delete element.final_EndWrittenDownValue;
//         delete element.total_DisposedEndRangeNumber;
//       });

//       res.status(200).send({
//         code: 200,
//         message: 'Successful',
//         stats: statsArray,
//         newStats: newStats,
//         total: 1
//       });
//     } else {
//       res.status(200).send({
//         code: 200,
//         message: 'Successful',
//         data: assets
//       });
//     }
//   } catch (error) {
//     console.log('error', error);
//     return res.status(500).send(error);
//   }
// };

// assetsController.addAsset = async (req, res) => {
//   const max_result = await Assets.aggregate([
//     { $group: { _id: null, max: { $max: { $toInt: '$Id' } } } }
//   ]);
//   let body = req.body;
//   if (max_result.length > 0) {
//     body['Id'] = max_result[0].max + 1;
//   } else {
//     body['Id'] = 1;
//   }
//   const assets = await Assets.find({});

//   const code =
//     returnPrefix(body.AssetCategory) +
//     (returnFinalMax(assets, body.AssetCategory) + 1);
//   body.AssetCode = code;
//   Assets.create(req.body, function(err, result) {
//     if (err) {
//       res.status(500).send(err);
//     } else {
//       var data = {
//         code: 200,
//         message: 'Data inserted successfully',
//         data: result
//       };
//       res.status(200).send(data);
//     }
//   });
// };

// function returnPrefix(type) {
//   if (type == 'Furniture & Fixture' || type == 'Furniture') {
//     return `FF-3-1-`;
//   } else if (type == 'Computer Equipment' || type == 'Office Equipment') {
//     return `OE-3-1-`;
//   } else if (type == 'Supplies') {
//     return `SUP-3-1-`;
//   } else if (type == 'Vehicles') {
//     return `VH-3-1-`;
//   } else if (type == 'Land') {
//     return `LA-3-1-`;
//   } else if (type == 'Building') {
//     return `B-3-1-`;
//   } else if (type == 'Audio & Visual Equipment') {
//     return `AV-3-1-`;
//   }
// }

// function returnFinalMax(assets_array, type) {
//   // this is because Office Equipment will have IDs max of Computer Equipment
//   if (type == 'Office Equipment') {
//     type = 'Computer Equipment';
//   }

//   const result = assets_array.filter(value => {
//     return value['AssetCategory'] == type;
//   });
//   if (result.length === 0) {
//     return 0;
//   } else {
//     const res = returnMax(result);

//     if (isNaN(parseFloat(res))) {
//       return 0;
//     } else {
//       return res;
//     }
//   }
// }

// function returnMax(array) {
//   return Math.max.apply(
//     Math,
//     array.map(function(o) {
//       return o.AssetCode.substring(o.AssetCode.lastIndexOf('-') + 1);
//     })
//   );
// }

// assetsController.test = async (req, res) => {
//   const result1 = await Assets.aggregate([
//     { $group: { _id: null, max: { $max: { $toInt: '$Id' } } } }
//   ]);
//   //Filter Furniture & Fixture category
//   const assets = await Assets.find({});
//   const furniture = assets.filter(value => {
//     return value['AssetCategory'] == 'Furniture & Fixture';
//   });
//   const max_furniture = returnMax(furniture);

//   const computer = assets.filter(value => {
//     return value['AssetCategory'] == 'Computer Equipment';
//   });

//   const max_computer = returnMax(computer);

//   //Filter Office equipment category

//   let office = assets.filter(value => {
//     return value['AssetCategory'] == 'Office Equipment';
//   });
//   const max_office = returnMax(office);

//   //Filter Audio & Visual Equipment category

//   let audio = assets.filter(value => {
//     return value['AssetCategory'] == 'Audio & Visual Equipment';
//   });
//   const max_audio = returnMax(audio);

//   //Filter Vehicles category
//   let vehicles = assets.filter(value => {
//     return value['AssetCategory'] == 'Vehicles';
//   });
//   const max_vehicles = returnMax(vehicles);

//   //Filter Supplies category
//   let land = assets.filter(value => {
//     return value['AssetCategory'] == 'Land';
//   });
//   const max_land = returnMax(land);

//   let buildings = assets.filter(value => {
//     return value['AssetCategory'] == 'Building';
//   });
//   const max_buildings = returnMax(buildings);

//   let supplies = assets.filter(value => {
//     return value['AssetCategory'] == 'Supplies';
//   });
//   const max_supplies = returnMax(supplies);

//   var data = {
//     code: 200,
//     result1,
//     max_furniture,
//     max_supplies,
//     max_buildings,
//     max_land,
//     max_computer,
//     max_vehicles,
//     max_audio,
//     max_office
//   };
//   res.status(200).send(data);
// };
// assetsController.updateAsset = async (req, res) => {
//   if (!req.params._id) {
//     res.status(500).send({
//       message: 'ID missing'
//     });
//   }
//   try {
//     const _id = req.params._id;
//     let updates = req.body;

//     runUpdate(_id, updates, res);
//   } catch (error) {
//     console.log('error', error);
//     return res.status(500).send(error);
//   }
// };

// function returnMonths(depreciationRate) {
//   if (depreciationRate == '20') {
//     return 60;
//   }
//   if (depreciationRate == '10') {
//     return 120;
//   }
//   if (depreciationRate == '5') {
//     return 240;
//   }
//   if (depreciationRate == '33.33') {
//     return 37;
//   }
// }
// async function runUpdate(_id, updates, res) {
//   try {
//     const result = await Assets.updateOne(
//       {
//         _id: _id
//       },
//       {
//         $set: updates
//       },
//       {
//         upsert: true,
//         runValidators: true
//       }
//     );

//     {
//       if (result.nModified == 1) {
//         res.status(200).send({
//           code: 200,
//           message: 'Updated Successfully'
//         });
//       } else if (result.upserted) {
//         res.status(200).send({
//           code: 200,
//           message: 'Created Successfully'
//         });
//       } else {
//         res.status(422).send({
//           code: 422,
//           message: 'Unprocessible Entity'
//         });
//       }
//     }
//   } catch (error) {
//     console.log('error', error);
//     return res.status(500).send(error);
//   }
// }

// assetsController.deleteAsset = async (req, res) => {
//   if (!req.params._id) {
//     res.status(500).send({
//       message: 'ID missing'
//     });
//   }
//   try {
//     const _id = req.params._id;

//     const result = await Assets.findOneAndDelete({
//       _id: _id
//     });
//     //   const result = await Assets.updateOne({
//     //         _id: _id
//     //     }, {
//     //         $set: {is_deleted: 1}
//     //     }, {
//     //         upsert: true,
//     //         runValidators: true
//     //     });
//     res.status(200).send({
//       code: 200,
//       message: 'Deleted Successfully'
//     });
//   } catch (error) {
//     console.log('error', error);
//     return res.status(500).send(error);
//   }
// };

// assetsController.assetStatistics = async (req, res) => {
//   try {
//     // const result = await Assets.findOneAndDelete({
//     //     _id: _id
//     // });

//     const Location = await Assets.aggregate([
//       { $group: { _id: '$Location', count: { $sum: 1 } } }
//     ]);
//     const AssetCategory = await Assets.aggregate([
//       { $group: { _id: '$AssetCategory', count: { $sum: 1 } } }
//     ]);
//     const SubCategory = await Assets.aggregate([
//       { $group: { _id: '$SubCategory', count: { $sum: 1 } } }
//     ]);
//     const Department = await Assets.aggregate([
//       { $group: { _id: '$Department', count: { $sum: 1 } } }
//     ]);
//     const PurchaseDate = await Assets.aggregate([
//       { $group: { _id: '$PurchaseDate', count: { $sum: 1 } } }
//     ]);
//     const IS_DISPOSED = await Assets.aggregate([
//       { $group: { _id: '$IS_DISPOSED', count: { $sum: 1 } } }
//     ]);

//     responseObj = {
//       Location,
//       AssetCategory,
//       SubCategory,
//       Department,
//       PurchaseDate,
//       IS_DISPOSED
//     };

//     res.status(200).send({
//       code: 200,
//       message: 'Stat',
//       data: responseObj
//     });
//   } catch (error) {
//     console.log('error', error);
//     return res.status(500).send(error);
//   }
// };
// assetsController.importAsset = async (req, res) => {
//   try {
//     // var outPath = path.join(__dirname, 'PATH_TO_JSON');

//     const jsonArray = await csv().fromFile('controllers/test.csv');
//     jsonArray.forEach(async currentItem => {
//       const result = await Assets.create(currentItem);
//     });
//   } catch (error) {
//     console.log('error', error);
//     return res.status(500).send(error);
//   }
// };

// assetsController.importAssetFile = async (req, res) => {
//   try {
//     const filePath = `./uploads/${req.file.originalname}`;
//     const jsonArray = await csv().fromFile(filePath);

//     const response = await Assets.insertMany(jsonArray);

//     // delete file
//     fs.unlink(filePath, function(err) {
//       if (err) return console.log(err);
//       console.log('file deleted successfully');
//       res.send({
//         message: `import complete.`
//       });
//     });
//   } catch (error) {
//     console.log('error', error);
//     return res.status(500).send(error);
//   }
// };

// // helper functions

// function returnMonthsDifference(d1, d2, bothmonths = false) {
//   const date1 = new Date(d1); //Remember, months are 0 based in JS
//   const date2 = new Date(d2);
//   const year1 = date1.getFullYear();
//   const year2 = date2.getFullYear();
//   let month1 = date1.getMonth();
//   let month2 = date2.getMonth();
//   if (month1 === 0) {
//     //Have to take into account
//     month1++;
//     month2++;
//   }
//   let numberOfMonths;

//   // 1.If you want just the number of the months between the two dates excluding both month1 and month2

//   // numberOfMonths = (year2 - year1) * 12 + (month2 - month1) - 1;

//   // 2.If you want to include either of the months
//   if (!bothmonths) {
//     numberOfMonths = (year2 - year1) * 12 + (month2 - month1);
//   }

//   // 3.If you want to include both of the months
//   if (bothmonths) {
//     numberOfMonths = (year2 - year1) * 12 + (month2 - month1) + 1;
//   }
//   // numberOfMonths = (year2 - year1) * 12 + (month2 - month1) + 1;

//   return numberOfMonths;
// }

// function calcDateDiff(d1) {
//   const b = moment(d1);
//   const a = moment(Date.now());
//   const years = a.diff(b, 'year');
//   b.add(years, 'years');

//   const months = a.diff(b, 'months');
//   b.add(months, 'months');

//   const days = a.diff(b, 'days');

//   // console.log(years + ' years ' + months + ' months ' + days + ' days');
//   if (years > 0) {
//     return `${years} years, ${months} months,  ${days} days`;
//   } else if (months > 0) {
//     return `${months} months,  ${days} days`;
//   } else {
//     return `${days} days`;
//   }
// }
// function calcDateDiff2(d1, d2) {
//   const b = moment(d1);
//   const a = moment(d2);
//   const years = a.diff(b, 'year');
//   b.add(years, 'years');

//   const months = a.diff(b, 'months');
//   b.add(months, 'months');

//   const days = a.diff(b, 'days');

//   // console.log(years + ' years ' + months + ' months ' + days + ' days');
//   if (years > 0) {
//     return `${years} years, ${months} months,  ${days} days`;
//   } else if (months > 0) {
//     return `${months} months,  ${days} days`;
//   } else {
//     return `${days} days`;
//   }
// }

// function isLater(str1, str2) {
//   return new Date(str1) < new Date(str2);
// }

// module.exports = assetsController;
