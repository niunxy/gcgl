// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.12/esri/copyright.txt for details.
//>>built
define({noLimit:"\u0411\u0435\u0437 \u043e\u0431\u043c\u0435\u0436\u0435\u043d\u043d\u044f",preview:"\u041f\u043e\u043f\u0435\u0440\u0435\u0434\u043d\u0456\u0439 \u043f\u0435\u0440\u0435\u0433\u043b\u044f\u0434",currentScaleTooltip:"\u041f\u043e\u0442\u043e\u0447\u043d\u0438\u0439 \u043c\u0430\u0441\u0448\u0442\u0430\u0431 \u043a\u0430\u0440\u0442\u0438 (${scaleLabel})",customScaleInputTooltip:"\u0412\u0432\u0435\u0434\u0456\u0442\u044c \u043c\u0430\u0441\u0448\u0442\u0430\u0431.",current:"\u041f\u043e\u0442\u043e\u0447\u043d\u0438\u0439",
setTo:"\u0417\u0430\u0434\u0430\u0442\u0438 \u0437\u043d\u0430\u0447\u0435\u043d\u043d\u044f",selectOne:"(\u0432\u0438\u0431\u0440\u0430\u0442\u0438 \u043e\u0434\u0438\u043d)",setToSelectOne:"${setTo} ${selectOne}",scaleRangeLabels:{world:"\u0421\u0432\u0456\u0442",continent:"\u041a\u043e\u043d\u0442\u0438\u043d\u0435\u043d\u0442",countries:"\u041a\u0440\u0430\u0457\u043d\u0438",country:"\u043a\u0440\u0430\u0457\u043d\u0430",states:"\u0428\u0442\u0430\u0442\u0438",state:"\u0428\u0442\u0430\u0442",
counties:"\u041e\u043a\u0440\u0443\u0433\u0438",county:"\u041e\u043a\u0440\u0443\u0433",metropolitanArea:"\u041c\u0456\u0441\u0442\u043e \u0437 \u043f\u0435\u0440\u0435\u0434\u043c\u0456\u0441\u0442\u044f\u043c\u0438",cities:"\u041c\u0456\u0441\u0442\u0430",city:"\u041c\u0456\u0441\u0442\u043e",town:"\u041c\u0456\u0441\u0442\u0435\u0447\u043a\u043e",neighborhood:"\u0420\u0430\u0439\u043e\u043d",streets:"\u0412\u0443\u043b\u0438\u0446\u0456",street:"\u0412\u0443\u043b\u0438\u0446\u044f",buildings:"\u0411\u0443\u0434\u0456\u0432\u043b\u0456",
building:"\u0411\u0443\u0434\u0456\u0432\u043b\u044f",smallBuilding:"\u041d\u0435\u0432\u0435\u043b\u0438\u043a\u0430 \u0431\u0443\u0434\u0456\u0432\u043b\u044f",rooms:"\u041a\u0456\u043c\u043d\u0430\u0442\u0438",room:"\u041a\u0456\u043c\u043d\u0430\u0442\u0430"},featuredScaleLabels:{current:"\u041f\u043e\u0442\u043e\u0447\u043d\u0438\u0439 \u0432\u0438\u0434 \u043a\u0430\u0440\u0442\u0438 (${scaleLabel})",world:"\u0421\u0432\u0456\u0442 (${scaleLabel})",continent:"\u041a\u043e\u043d\u0442\u0438\u043d\u0435\u043d\u0442 (${scaleLabel})",
countriesBig:"\u041a\u0440\u0430\u0457\u043d\u0438 - \u0432\u0435\u043b\u0438\u043a\u0456 (${scaleLabel})",countriesSmall:"\u041a\u0440\u0430\u0457\u043d\u0438 - \u043c\u0430\u043b\u0456 (${scaleLabel})",statesProvinces:"\u0428\u0442\u0430\u0442\u0438 / \u043f\u0440\u043e\u0432\u0456\u043d\u0446\u0456\u0457 (${scaleLabel})",stateProvince:"\u0428\u0442\u0430\u0442/\u043f\u0440\u043e\u0432\u0456\u043d\u0446\u0456\u044f (${scaleLabel})",counties:"\u041e\u043a\u0440\u0443\u0433\u0438 (${scaleLabel})",
county:"\u041e\u043a\u0440\u0443\u0433 (${scaleLabel})",metropolitanArea:"\u041c\u0456\u0441\u0442\u043e \u0437 \u043f\u0435\u0440\u0435\u0434\u043c\u0456\u0441\u0442\u044f\u043c\u0438 (${scaleLabel})",cities:"\u041c\u0456\u0441\u0442\u0430 (${scaleLabel})",city:"\u041c\u0456\u0441\u0442\u043e (${scaleLabel})",town:"\u041c\u0456\u0441\u0442\u0435\u0447\u043a\u043e (${scaleLabel})",neighborhood:"\u0420\u0430\u0439\u043e\u043d (${scaleLabel})",streets:"\u0412\u0443\u043b\u0438\u0446\u0456 (${scaleLabel})",
street:"\u0412\u0443\u043b\u0438\u0446\u044f (${scaleLabel})",buildings:"\u0411\u0443\u0434\u0456\u0432\u043b\u0456 (${scaleLabel})",building:"\u0411\u0443\u0434\u0456\u0432\u043b\u044f (${scaleLabel})",smallBuilding:"\u041d\u0435\u0432\u0435\u043b\u0438\u043a\u0430 \u0431\u0443\u0434\u0456\u0432\u043b\u044f (${scaleLabel})",rooms:"\u041a\u0456\u043c\u043d\u0430\u0442\u0438 (${scaleLabel})",room:"\u041a\u0456\u043c\u043d\u0430\u0442\u0430 (${scaleLabel})"}});