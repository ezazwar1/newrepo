/**
 * Created by alberto on 22/05/14.
 */

var localeLang = navigator.language.split('-')[0];
/*Cambiar a los idiomas que sean necesario, esta puesto por defecto ingles!!*/

if(localeLang!="es"){
  localeLang = "en";
}

var localeDB = "PageDB_"+localeLang;

