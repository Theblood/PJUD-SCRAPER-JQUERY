(function () {
  // ════════════════════════════════════════════════════════════════
  // CONFIG
  // ════════════════════════════════════════════════════════════════
  const CONCURRENCY       = 3;
  const MAX_RETRIES       = 5;
  const RETRY_BASE        = 500;
  const RECAPTCHA_SITEKEY = '6LelLWkUAAAAANPDMkBxllo_QJe5RQVpg6V2pIDt';

  // ════════════════════════════════════════════════════════════════
  // TRIBUNALES HARDCODEADOS (no depende del DOM)
  // ════════════════════════════════════════════════════════════════
  const TRIBUNALES_ALL = [
    {value:"6",   label:"Juzgado De Letras Y Garantía De Pozo Almonte",       region:"tar"},
    {value:"14",  label:"Juzgado De Letras Y Garantía De María Elena",         region:"antof"},
    {value:"26",  label:"Juzgado De Letras Y Garantía De Taltal",              region:"antof"},
    {value:"27",  label:"Juzgado De Letras Y Garantía De Chañaral",            region:"atac"},
    {value:"34",  label:"Juzgado De Letras Y Garantía De Freirina",            region:"atac"},
    {value:"47",  label:"Juzgado De Letras Y Garantía De Andacollo",           region:"coq"},
    {value:"51",  label:"Juzgado De Letras Y Garantía De Combarbala",          region:"coq"},
    {value:"53",  label:"Juzgado De Letras Y Garantía De Los Vilos",           region:"coq"},
    {value:"88",  label:"Juzgado De Letras Y Garantía De Petorca",             region:"valpo"},
    {value:"94",  label:"Juzgado De Letras Y Garantía De Putaendo",            region:"valpo"},
    {value:"103", label:"Juzgado De Letras Y Garantía De Isla De Pascua",      region:"rapa"},
    {value:"114", label:"1º Juzgado De Letras Y Garantía De Peumo",            region:"ohig"},
    {value:"119", label:"Juzgado De Letras Y Garantía De Pichilemu",           region:"ohig"},
    {value:"127", label:"Juzgado De Letras Y Garantía De Curepto",             region:"maule"},
    {value:"132", label:"Juzgado De Letras Y Garantía De Licanten",            region:"maule"},
    {value:"140", label:"Juzgado De Letras Y Garantía De Chanco",              region:"maule"},
    {value:"150", label:"Juzgado De Letras Y Garantía De Bulnes",              region:"nuble"},
    {value:"151", label:"Juzgado De Letras Y Garantía De Coelemu",             region:"nuble"},
    {value:"152", label:"Juzgado De Letras Y Garantía De Quirihue",            region:"nuble"},
    {value:"157", label:"Juzgado De Letras Y Garantía De Mulchen",             region:"arau"},
    {value:"158", label:"Juzgado De Letras Y Garantía De Nacimiento",          region:"bio"},
    {value:"159", label:"Juzgado De Letras Y Garantía De Laja",                region:"bio"},
    {value:"160", label:"Juzgado De Letras Y Garantía De Yumbel",              region:"bio"},
    {value:"188", label:"Juzgado De Letras Y Garantía De Florida",             region:"bio"},
    {value:"189", label:"Juzgado De Letras Y Garantía De Santa Juana",         region:"bio"},
    {value:"190", label:"Juzgado De Letras Y Garantía De Lota",                region:"bio"},
    {value:"193", label:"Juzgado De Letras Y Garantía De Lebu",                region:"bio"},
    {value:"195", label:"Juzgado De Letras Y Garantía De Curanilahue",         region:"bio"},
    {value:"206", label:"Juzgado De Letras Y Garantía De Collipulli",          region:"arau"},
    {value:"207", label:"Juzgado De Letras Y Garantía De Traiguen",            region:"arau"},
    {value:"209", label:"Juzgado De Letras Y Garantía De Curacautin",          region:"arau"},
    {value:"214", label:"Juzgado De Letras Y Garantía De Pucon",               region:"arau"},
    {value:"216", label:"Juzgado De Letras Y Garantía De Carahue",             region:"arau"},
    {value:"223", label:"Juzgado De Letras Y Garantía De Paillaco",            region:"losrios"},
    {value:"225", label:"Juzgado De Letras Y Garantía De Panguipulli",         region:"losrios"},
    {value:"226", label:"Juzgado De Letras Y Garantia De La Union",            region:"losrios"},
    {value:"227", label:"Juzgado De Letras Y Garantía De Río Bueno",           region:"losrios"},
    {value:"240", label:"Juzgado De Letras Y Garantía De Calbuco",             region:"loslagos"},
    {value:"241", label:"Juzgado De Letras Y Garantía De Maullin",             region:"loslagos"},
    {value:"244", label:"Juzgado De Letras Y Garantía De Achao",               region:"loslagos"},
    {value:"245", label:"Juzgado De Letras Y Garantía De Chaiten",             region:"loslagos"},
    {value:"248", label:"Juzgado De Letras Y Garantía De Puerto Aysen",        region:"aysen"},
    {value:"249", label:"Juzgado De Letras Y Garantía De Chile Chico",         region:"aysen"},
    {value:"250", label:"Juzgado De Letras Y Garantía De Cochrane",            region:"aysen"},
    {value:"257", label:"Juzgado De Letras Y Garantía De Puerto Natales",      region:"mag"},
    {value:"258", label:"Juzgado De Letras Y Garantía De Porvenir",            region:"mag"},
    {value:"385", label:"Juzgado De Letras Y Garantía De Santa Barbara",       region:"bio"},
    {value:"386", label:"Juzgado De Letras Y Garantía De Caldera",             region:"atac"},
    {value:"659", label:"Juzgado De Letras Y Garantía De Los Muermos",         region:"loslagos"},
    {value:"660", label:"Juzgado De Letras Y Garantía De Quintero",            region:"valpo"},
    {value:"662", label:"Juzgado De Letras Y Garantía De Quellon",             region:"loslagos"},
    {value:"927", label:"Tribunal De Juicio Oral En Lo Penal De La Serena",    region:"coq"},
    {value:"928", label:"Tribunal De Juicio Oral En Lo Penal De Ovalle",       region:"coq"},
    {value:"929", label:"Juzgado De Garantía De La Serena",                    region:"coq"},
    {value:"930", label:"Juzgado De Garantía De Coquimbo",                     region:"coq"},
    {value:"931", label:"Juzgado De Garantía De Vicuña",                       region:"coq"},
    {value:"932", label:"Juzgado De Garantía De Ovalle",                       region:"coq"},
    {value:"933", label:"Juzgado De Garantía De Illapel",                      region:"coq"},
    {value:"934", label:"Tribunal De Juicio Oral En Lo Penal De Temuco",       region:"arau"},
    {value:"935", label:"Tribunal De Juicio Oral En Lo Penal De Angol",        region:"arau"},
    {value:"936", label:"Tribunal De Juicio Oral En Lo Penal De Villarrica",   region:"arau"},
    {value:"937", label:"Juzgado De Garantía De Temuco",                       region:"arau"},
    {value:"938", label:"Juzgado De Garantía De Pitrufquen",                   region:"arau"},
    {value:"939", label:"Juzgado De Garantía De Villarrica",                   region:"arau"},
    {value:"940", label:"Juzgado De Garantía De Angol",                        region:"arau"},
    {value:"941", label:"Juzgado De Garantía De Victoria",                     region:"arau"},
    {value:"942", label:"Juzgado De Garantía De Nueva Imperial",               region:"arau"},
    {value:"943", label:"Juzgado De Garantía De Lautaro",                      region:"arau"},
    {value:"944", label:"Juzgado De Garantía De Loncoche",                     region:"arau"},
    {value:"946", label:"Juzgado De Letras Y Garantía De Tolten",              region:"arau"},
    {value:"947", label:"Juzgado De Letras Y Garantía De Puren",               region:"arau"},
    {value:"948", label:"Tribunal De Juicio Oral En Lo Penal De Calama",       region:"antof"},
    {value:"949", label:"Tribunal De Juicio Oral En Lo Penal De Antofagasta",  region:"antof"},
    {value:"950", label:"Juzgado De Garantía De Tocopilla",                    region:"antof"},
    {value:"951", label:"Juzgado De Garantía De Calama",                       region:"antof"},
    {value:"952", label:"Juzgado De Garantía De Antofagasta",                  region:"antof"},
    {value:"953", label:"Tribunal De Juicio Oral En Lo Penal De Copiapo",      region:"atac"},
    {value:"954", label:"Juzgado De Garantía De Diego De Almagro",             region:"atac"},
    {value:"955", label:"Juzgado De Garantía De Copiapo",                      region:"atac"},
    {value:"956", label:"Juzgado De Garantía De Vallenar",                     region:"atac"},
    {value:"957", label:"Tribunal De Juicio Oral En Lo Penal De Curico",       region:"maule"},
    {value:"958", label:"Tribunal De Juicio Oral En Lo Penal De Talca",        region:"maule"},
    {value:"959", label:"Tribunal De Juicio Oral En Lo Penal De Linares",      region:"maule"},
    {value:"960", label:"Tribunal De Juicio Oral En Lo Penal De Cauquenes",    region:"maule"},
    {value:"961", label:"Juzgado De Garantía De Curico",                       region:"maule"},
    {value:"962", label:"Juzgado De Garantía De Molina",                       region:"maule"},
    {value:"963", label:"Juzgado De Garantía De Constitución",                 region:"maule"},
    {value:"964", label:"Juzgado De Garantía De Talca",                        region:"maule"},
    {value:"965", label:"Juzgado De Garantía De San Javier",                   region:"maule"},
    {value:"966", label:"Juzgado De Garantía De Cauquenes",                    region:"maule"},
    {value:"967", label:"Juzgado De Garantía De Linares",                      region:"maule"},
    {value:"968", label:"Juzgado De Garantía De Parral",                       region:"maule"},
    {value:"988", label:"Tribunal De Juicio Oral En Lo Penal De Arica",        region:"arica"},
    {value:"989", label:"Tribunal De Juicio Oral En Lo Penal De Iquique",      region:"tar"},
    {value:"990", label:"Tribunal De Juicio Oral En Lo Penal De Coyhaique",    region:"aysen"},
    {value:"991", label:"Tribunal De Juicio Oral En Lo Penal Punta Arenas",    region:"mag"},
    {value:"992", label:"Juzgado De Garantía De Arica",                        region:"arica"},
    {value:"993", label:"Juzgado De Garantía De Iquique",                      region:"tar"},
    {value:"994", label:"Juzgado De Garantía De Coyhaique",                    region:"aysen"},
    {value:"995", label:"Juzgado De Garantía De Punta Arenas",                 region:"mag"},
    {value:"996", label:"Juzgado De Letras Y Garantía De Cisnes",              region:"aysen"},
    {value:"1013",label:"Juzgado De Letras Y Garantía De Hualaihue",           region:"loslagos"},
    {value:"1045",label:"Juzgado De Garantía De Valparaíso",                   region:"valpo"},
    {value:"1046",label:"Juzgado De Garantia De Viña Del Mar",                 region:"valpo"},
    {value:"1047",label:"Juzgado De Garantía De Quilpué",                      region:"valpo"},
    {value:"1048",label:"Tribunal De Juicio Oral En Lo Penal Viña Del Mar",    region:"valpo"},
    {value:"1049",label:"Juzgado De Garantía De San Antonio",                  region:"valpo"},
    {value:"1050",label:"Juzgado De Garantía De Casablanca",                   region:"valpo"},
    {value:"1051",label:"Juzgado De Garantía De La Ligua",                     region:"valpo"},
    {value:"1052",label:"Juzgado De Garantía De San Felipe",                   region:"valpo"},
    {value:"1053",label:"Tribunal De Juicio Oral En Lo Penal De Quillota",     region:"valpo"},
    {value:"1054",label:"Tribunal De Juicio Oral En Lo Penal De Valparaíso",   region:"valpo"},
    {value:"1055",label:"Juzgado De Garantía De Limache",                      region:"valpo"},
    {value:"1056",label:"Juzgado De Garantía De La Calera",                    region:"valpo"},
    {value:"1057",label:"Juzgado De Garantía De Quillota",                     region:"valpo"},
    {value:"1058",label:"Tribunal De Juicio Oral En Lo Penal De Los Andes",    region:"valpo"},
    {value:"1059",label:"Tribunal De Juicio Oral En Lo Penal De San Felipe",   region:"valpo"},
    {value:"1060",label:"Juzgado De Garantía De Los Andes",                    region:"valpo"},
    {value:"1061",label:"Juzgado De Garantía De Villa Alemana",                region:"valpo"},
    {value:"1062",label:"Tribunal De Juicio Oral En Lo Penal San Antonio",     region:"valpo"},
    {value:"1063",label:"Juzgado De Garantía De San Fernando",                 region:"ohig"},
    {value:"1064",label:"Tribunal De Juicio Oral En Lo Penal De Santa Cruz",   region:"ohig"},
    {value:"1065",label:"Juzgado De Garantía De Santa Cruz",                   region:"ohig"},
    {value:"1067",label:"Juzgado De Garantía De Rengo",                        region:"ohig"},
    {value:"1068",label:"Tribunal De Juicio Oral En Lo Penal San Fernando",    region:"ohig"},
    {value:"1069",label:"Juzgado De Garantía De Graneros",                     region:"ohig"},
    {value:"1070",label:"Juzgado De Garantía De Rancagua",                     region:"ohig"},
    {value:"1071",label:"Tribunal De Juicio Oral En Lo Penal De Rancagua",     region:"ohig"},
    {value:"1072",label:"Juzgado De Garantía De Chillán",                      region:"nuble"},
    {value:"1073",label:"Juzgado De Garantía De Yungay",                       region:"nuble"},
    {value:"1074",label:"Juzgado De Garantía De San Carlos",                   region:"nuble"},
    {value:"1075",label:"Juzgado De Garantía De San Pedro De La Paz",          region:"bio"},
    {value:"1076",label:"Juzgado De Garantía De Cañete",                       region:"bio"},
    {value:"1077",label:"Juzgado De Garantía De Arauco",                       region:"bio"},
    {value:"1078",label:"Juzgado De Garantía De Coronel",                      region:"bio"},
    {value:"1079",label:"Juzgado De Garantía De Tomé",                         region:"bio"},
    {value:"1080",label:"Juzgado De Garantía De Talcahuano",                   region:"bio"},
    {value:"1081",label:"Juzgado De Garantía De Chiguayante",                  region:"bio"},
    {value:"1082",label:"Juzgado De Garantía De Concepción",                   region:"bio"},
    {value:"1083",label:"Juzgado De Garantía De Los Angeles",                  region:"bio"},
    {value:"1084",label:"Juzgado De Garantía De Valdivia",                     region:"losrios"},
    {value:"1085",label:"Juzgado De Garantía De Mariquina",                    region:"losrios"},
    {value:"1086",label:"Juzgado De Garantía De Los Lagos",                    region:"losrios"},
    {value:"1087",label:"Juzgado De Garantía De Río Negro",                    region:"loslagos"},
    {value:"1088",label:"Juzgado De Garantía De Osorno",                       region:"loslagos"},
    {value:"1089",label:"Juzgado De Garantía De Castro",                       region:"loslagos"},
    {value:"1090",label:"Juzgado De Garantía De Puerto Montt",                 region:"loslagos"},
    {value:"1091",label:"Juzgado De Garantía De Puerto Varas",                 region:"loslagos"},
    {value:"1092",label:"Juzgado De Garantía De Ancud",                        region:"loslagos"},
    {value:"1093",label:"Tribunal De Juicio Oral En Lo Penal De Chillán",      region:"nuble"},
    {value:"1094",label:"Tribunal De Juicio Oral En Lo Penal De Concepción",   region:"bio"},
    {value:"1095",label:"Tribunal De Juicio Oral En Lo Penal De Valdivia",     region:"losrios"},
    {value:"1096",label:"Tribunal De Juicio Oral En Lo Penal Puerto Montt",    region:"loslagos"},
    {value:"1097",label:"Juzgado De Garantía De San Vicente De Tagua-Tagua",   region:"ohig"},
    {value:"1150",label:"Juzgado De Letras Y Garantía De Litueche",            region:"ohig"},
    {value:"1151",label:"Juzgado De Letras Y Garantía De Peralillo",           region:"ohig"},
    {value:"1152",label:"Juzgado De Letras Y Garantía De Cabrero",             region:"bio"},
    {value:"1220",label:"1º Juzgado De Garantía De Santiago",                  region:"rm"},
    {value:"1221",label:"2º Juzgado De Garantía De Santiago",                  region:"rm"},
    {value:"1222",label:"3º Juzgado De Garantía De Santiago",                  region:"rm"},
    {value:"1223",label:"4º Juzgado De Garantía De Santiago",                  region:"rm"},
    {value:"1224",label:"5º Juzgado De Garantía De Santiago",                  region:"rm"},
    {value:"1225",label:"6º Juzgado De Garantía De Santiago",                  region:"rm"},
    {value:"1226",label:"7º Juzgado De Garantía De Santiago",                  region:"rm"},
    {value:"1227",label:"8º Juzgado De Garantía De Santiago",                  region:"rm"},
    {value:"1228",label:"9º Juzgado De Garantía De Santiago",                  region:"rm"},
    {value:"1229",label:"10º Juzgado De Garantía De Santiago",                 region:"rm"},
    {value:"1230",label:"11º Juzgado De Garantía De Santiago",                 region:"rm"},
    {value:"1231",label:"12º Juzgado De Garantía De Santiago",                 region:"rm"},
    {value:"1232",label:"13º Juzgado De Garantía De Santiago",                 region:"rm"},
    {value:"1233",label:"14º Juzgado De Garantía De Santiago",                 region:"rm"},
    {value:"1234",label:"15º Juzgado De Garantía De Santiago",                 region:"rm"},
    {value:"1235",label:"Juzgado De Garantía De Colina",                       region:"rm"},
    {value:"1236",label:"Juzgado De Garantía De Puente Alto",                  region:"rm"},
    {value:"1237",label:"Juzgado De Garantía De San Bernardo",                 region:"rm"},
    {value:"1238",label:"Juzgado De Garantía De Melipilla",                    region:"rm"},
    {value:"1239",label:"Juzgado De Garantía De Curacaví",                     region:"rm"},
    {value:"1240",label:"Juzgado De Garantía De Talagante",                    region:"rm"},
    {value:"1244",label:"1º Tribunal De Juicio Oral En Lo Penal De Santiago",  region:"rm"},
    {value:"1245",label:"2º Tribunal De Juicio Oral En Lo Penal De Santiago",  region:"rm"},
    {value:"1246",label:"3º Tribunal De Juicio Oral En Lo Penal De Santiago",  region:"rm"},
    {value:"1247",label:"4º Tribunal De Juicio Oral En Lo Penal De Santiago",  region:"rm"},
    {value:"1248",label:"5º Tribunal De Juicio Oral En Lo Penal De Santiago",  region:"rm"},
    {value:"1249",label:"6º Tribunal De Juicio Oral En Lo Penal De Santiago",  region:"rm"},
    {value:"1250",label:"7º Tribunal De Juicio Oral En Lo Penal De Santiago",  region:"rm"},
    {value:"1251",label:"Tribunal De Juicio Oral En Lo Penal De Osorno",       region:"loslagos"},
    {value:"1320",label:"Tribunal De Juicio Oral En Lo Penal Talagante",       region:"rm"},
    {value:"1321",label:"Tribunal De Juicio Oral En Lo Penal Colina",          region:"rm"},
    {value:"1322",label:"Tribunal De Juicio Oral En Lo Penal Puente Alto",     region:"rm"},
    {value:"1323",label:"Tribunal De Juicio Oral En Lo Penal San Bernardo",    region:"rm"},
    {value:"1325",label:"Tribunal Oral En Lo Penal De Los Angeles",            region:"bio"},
    {value:"1326",label:"Tribunal Oral En Lo Penal De Cañete",                 region:"bio"},
    {value:"1328",label:"Tribunal Oral En Lo Penal De Castro",                 region:"loslagos"},
    {value:"1355",label:"Tribunal De Juicio Oral En Lo Penal De Melipilla",    region:"rm"},
    {value:"1500",label:"Juzgado De Letras Y Garantia De Alto Hospicio",       region:"tar"},
    {value:"1501",label:"Juzgado De Letras Y Garantia De Mejillones",          region:"antof"},
    {value:"1502",label:"Juzgado De Letras Y Garantia De Cabo De Hornos",      region:"mag"},
    {value:"1503",label:"Unidad Especializada RPA",                            region:"rm"},
    {value:"6000",label:"Corte Suprema - Primera Instancia",                   region:"rm"}
  ];

  // ════════════════════════════════════════════════════════════════
  // ESTILOS CYBERPUNK
  // ════════════════════════════════════════════════════════════════
  const styleEl = document.createElement('style');
  styleEl.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');
    @keyframes glitch {
      0%   { text-shadow: 2px 2px #ff00de, -2px -2px #00fff9; }
      25%  { text-shadow:-2px  2px #ff00de,  2px -2px #00fff9; }
      50%  { text-shadow: 2px -2px #ff00de, -2px  2px #00fff9; }
      75%  { text-shadow:-2px -2px #ff00de,  2px  2px #00fff9; }
      100% { text-shadow: 2px  2px #ff00de, -2px -2px #00fff9; }
    }
    @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
    @keyframes fadeIn { from{opacity:0;transform:translateX(10px)} to{opacity:1;transform:none} }
    @keyframes spin   { to{transform:rotate(360deg)} }

    #_cy-root * { box-sizing:border-box; margin:0; padding:0; font-family:'Share Tech Mono',monospace; }
    #_cy-root ::-webkit-scrollbar{width:6px;height:6px}
    #_cy-root ::-webkit-scrollbar-track{background:rgba(0,0,0,.5);border:1px solid #00ff00}
    #_cy-root ::-webkit-scrollbar-thumb{background:#00ff00;box-shadow:0 0 6px #00ff00}

    .cy-tl { color:#00ff00; font-size:11px; padding:2px 8px; line-height:1.7;
             text-shadow:0 0 5px #00ff00; border-left:2px solid transparent; word-break:break-all; }
    .cy-tl:hover { background:rgba(0,255,0,.07); border-left-color:#00ff00; }
    .cy-tl::before { content:'> '; color:#ff00de; }
    .cy-tl.scan    { color:#ff00de; text-shadow:0 0 8px #ff00de; }
    .cy-tl.success { color:#00ff00; }
    .cy-tl.error   { color:#ff0000; text-shadow:0 0 8px #ff0000; }
    .cy-tl.warn    { color:#ffff00; text-shadow:0 0 8px #ffff00; }
    .cy-tl.info    { color:#00fff9; text-shadow:0 0 8px #00fff9; }
    .cy-tl.hit     { color:#58a6ff; font-weight:bold; text-shadow:0 0 8px #58a6ff; }

    .cy-btn {
      padding:8px 14px; border:2px solid; cursor:pointer; font-size:12px;
      font-family:'Share Tech Mono',monospace; transition:all .2s; background:transparent;
    }
    .cy-btn:hover { filter:brightness(1.3); }
    .cy-btn-cyan  { border-color:#00fff9; color:#00fff9; }
    .cy-btn-cyan:hover  { background:#00fff9; color:#000; }
    .cy-btn-pink  { border-color:#ff00de; color:#ff00de; }
    .cy-btn-pink:hover  { background:#ff00de; color:#000; }
    .cy-btn-red   { border-color:#ff0000; color:#ff0000; }
    .cy-btn-red:hover   { background:#ff0000; color:#000; }
    .cy-btn-green { border-color:#00ff00; color:#00ff00; }
    .cy-btn-green:hover { background:#00ff00; color:#000; }
    .cy-btn-purple{ border-color:#a371f7; color:#a371f7; }
    .cy-btn-purple:hover{ background:#a371f7; color:#000; }
    .cy-btn:disabled { opacity:.35; cursor:not-allowed; filter:none; }

    .cy-input {
      background:rgba(0,0,0,.85); border:1px solid #00fff9; color:#00fff9;
      padding:6px 10px; font-family:'Share Tech Mono',monospace; font-size:11px;
      width:100%; outline:none; transition:border-color .2s;
    }
    .cy-input:focus { border-color:#ff00de; box-shadow:0 0 8px rgba(255,0,222,.4); }
    .cy-input::placeholder { color:#484f58; }
    .cy-select { background:rgba(0,0,0,.85); border:1px solid #00fff9; color:#00fff9; padding:6px 10px; font-family:'Share Tech Mono',monospace; font-size:11px; width:100%; outline:none; }

    .cy-label { color:#00fff9; font-size:9px; letter-spacing:1px; text-transform:uppercase; display:block; margin-bottom:3px; }

    /* Tabla principal */
    #_cy-table { width:max-content; min-width:100%; border-collapse:collapse; font-size:10px; }
    #_cy-table thead { position:sticky; top:0; z-index:5;
      background:linear-gradient(135deg,rgba(0,255,249,.2),rgba(255,0,222,.2)); }
    #_cy-table th { padding:7px 10px; border:1px solid rgba(0,255,249,.4); color:#00fff9;
      white-space:nowrap; text-transform:uppercase; font-size:9px; letter-spacing:1px; }
    #_cy-table td { padding:6px 10px; border:1px solid rgba(0,255,249,.15); vertical-align:top; }
    #_cy-table tbody tr { animation:fadeIn .25s ease; transition:background .2s; }
    #_cy-table tbody tr:hover td { background:rgba(0,255,249,.06); }
    .cy-rit   { color:#00fff9; font-weight:bold; white-space:nowrap; }
    .cy-ruc   { color:#00ff00; font-size:9px; font-family:monospace; white-space:nowrap; }
    .cy-trib  { color:#8b949e; font-size:9px; max-width:120px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
    .cy-cara  { color:#e6edf3; max-width:150px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
    .cy-fecha { color:#8b949e; font-size:9px; white-space:nowrap; font-family:monospace; }
    .cy-estado-pill { display:inline-block; font-size:8px; padding:2px 6px; border-radius:2px; white-space:nowrap; }
    .cy-concluida { background:rgba(0,255,0,.15); color:#00ff00; border:1px solid #00ff00; }
    .cy-activa    { background:rgba(255,165,0,.15); color:#ffa500; border:1px solid #ffa500; }

    /* Litigantes / relaciones en la tabla */
    .cy-lit-item { padding:2px 4px; margin:1px 0; background:rgba(0,255,249,.08); border-left:2px solid #00fff9; font-size:9px; }
    .cy-lit-tipo { color:#f59c17; font-size:8px; }
    .cy-lit-nom  { color:#00fff9; }
    .cy-rel-item { padding:2px 4px; margin:1px 0; background:rgba(255,0,222,.08); border-left:2px solid #ff00de; font-size:9px; }
    .cy-rel-delito{ color:white; font-weight:bold; }
    .cy-rel-nom  { color:#00fff9; font-size:8px; }
    .cy-rel-est  { color:#00ff00; font-size:8px; }
    .cy-pending  { color:#484f58; font-style:italic; font-size:9px; }
    .cy-loading  { color:#d29922; font-size:9px; animation:pulse 1s infinite; }
    .cy-err      { color:#f85149; font-size:9px; }

    /* Progress bar */
    .cy-prog-wrap { height:6px; background:rgba(0,0,0,.6); border:1px solid #00fff9; overflow:hidden; }
    .cy-prog-fill { height:100%; background:linear-gradient(90deg,#00fff9,#ff00de); transition:width .3s ease; }
  `;
  document.head.appendChild(styleEl);

  // ════════════════════════════════════════════════════════════════
  // HTML ROOT
  // ════════════════════════════════════════════════════════════════
  const prev = document.getElementById('_cy-root');
  if (prev) prev.remove();

  const root = document.createElement('div');
  root.id = '_cy-root';
  root.style.cssText = `
    position:fixed;top:0;left:0;right:0;bottom:0;z-index:999999;
    background:linear-gradient(135deg,#0a0a0a 0%,#1a0033 100%);
    display:flex;flex-direction:column;overflow:hidden;
  `;

  root.innerHTML = `
    <!-- HEADER -->
    <div style="padding:10px 20px;background:linear-gradient(90deg,rgba(0,255,249,.12),rgba(255,0,222,.12));
      border-bottom:2px solid #00fff9;display:flex;justify-content:space-between;align-items:center;flex-shrink:0;
      box-shadow:0 2px 20px rgba(0,255,249,.25);">
      <div>
        <div style="color:#00fff9;font-size:20px;text-shadow:0 0 20px #00fff9;animation:glitch 3s infinite;">
          ⚡ CYBER SCRAPER v4.0 ⚡
        </div>
        <div style="color:#ff00de;font-size:9px;margin-top:2px;letter-spacing:2px;">
          SISTEMA DE BÚSQUEDA JUDICIAL — REQUEST DIRECTO
        </div>
      </div>
      <button id="_cy-close" class="cy-btn cy-btn-pink">[X] CERRAR</button>
    </div>

    <!-- BODY -->
    <div style="display:flex;flex:1;overflow:hidden;min-height:0;">

      <!-- PANEL IZQUIERDO -->
      <div style="width:400px;flex-shrink:0;border-right:2px solid #00fff9;display:flex;flex-direction:column;
        background:rgba(0,0,0,.45);overflow:hidden;">

        <!-- FORMULARIO -->
        <div style="padding:14px;overflow-y:auto;flex-shrink:0;border-bottom:1px solid rgba(0,255,249,.3);">
          <div style="margin-bottom:8px;"><label class="cy-label">▸ Nombre</label>
            <input class="cy-input" id="_cy-nom" placeholder="JUAN"></div>
          <div style="margin-bottom:8px;"><label class="cy-label">▸ Apellido Paterno</label>
            <input class="cy-input" id="_cy-pat" placeholder="PEREZ"></div>
          <div style="margin-bottom:8px;"><label class="cy-label">▸ Apellido Materno</label>
            <input class="cy-input" id="_cy-mat" placeholder="PEREZ"></div>
          <div style="margin-bottom:8px;"><label class="cy-label">▸ Año (opcional)</label>
            <input class="cy-input" id="_cy-anio" placeholder="2019" maxlength="4"></div>
          <div style="margin-bottom:8px;"><label class="cy-label">▸ Región</label>
            <select class="cy-select" id="_cy-region">
              <option value="all">TODAS (Chile completo)</option>
              <option value="rm">Región Metropolitana</option>
              <option value="valpo">Valparaíso</option>
              <option value="coq">Coquimbo</option>
              <option value="antof">Antofagasta</option>
              <option value="tar">Tarapacá</option>
              <option value="arica">Arica y Parinacota</option>
              <option value="atac">Atacama</option>
              <option value="ohig">O'Higgins</option>
              <option value="maule">Maule</option>
              <option value="nuble">Ñuble</option>
              <option value="bio">Biobío</option>
              <option value="arau">La Araucanía</option>
              <option value="losrios">Los Ríos</option>
              <option value="loslagos">Los Lagos</option>
              <option value="aysen">Aysén</option>
              <option value="mag">Magallanes</option>
              <option value="rapa">Rapa Nui</option>
            </select>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:8px;">
            <div><label class="cy-label">Concurrencia</label>
              <input class="cy-input" id="_cy-conc" value="${CONCURRENCY}" maxlength="2"></div>
            <div><label class="cy-label">Reintentos</label>
              <input class="cy-input" id="_cy-retries" value="${MAX_RETRIES}" maxlength="2"></div>
            <div><label class="cy-label">Delay ms</label>
              <input class="cy-input" id="_cy-delay" value="${RETRY_BASE}"></div>
          </div>
          <div style="margin-bottom:10px;display:flex;gap:12px;align-items:center;">
            <label style="color:#ff00de;font-size:10px;cursor:pointer;display:flex;align-items:center;gap:5px;">
              <input type="checkbox" id="_cy-deep" checked> DEEP SCAN
            </label>
          </div>
          <div style="display:flex;flex-direction:column;gap:6px;">
            <button id="_cy-run"  class="cy-btn cy-btn-cyan" style="width:100%;font-size:13px;padding:10px;">⚡ INICIAR BÚSQUEDA ⚡</button>
            <button id="_cy-stop" class="cy-btn cy-btn-red"  style="width:100%;display:none;">⏹ ABORTAR OPERACIÓN</button>
            <div style="display:flex;gap:6px;">
              <button id="_cy-csv"  class="cy-btn cy-btn-green"  style="flex:1;display:none;">📊 CSV</button>
              <button id="_cy-json" class="cy-btn cy-btn-purple" style="flex:1;display:none;">📥 JSON</button>
            </div>
          </div>
        </div>

        <!-- STATS -->
        <div id="_cy-stats" style="padding:10px 14px;background:rgba(0,255,249,.04);border-bottom:1px solid rgba(0,255,249,.2);flex-shrink:0;display:none;">
          <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin-bottom:8px;">
            <div><div style="color:#00fff9;font-size:8px;letter-spacing:1px;">CAUSAS</div>
              <div style="color:#00ff00;font-size:18px;font-weight:bold;" id="_cy-s-causas">0</div></div>
            <div><div style="color:#00fff9;font-size:8px;letter-spacing:1px;">TRIBUNALES</div>
              <div style="color:#00ff00;font-size:18px;font-weight:bold;" id="_cy-s-tribs">0</div></div>
            <div><div style="color:#00fff9;font-size:8px;letter-spacing:1px;">DETALLES</div>
              <div style="color:#00ff00;font-size:18px;font-weight:bold;" id="_cy-s-dets">0</div></div>
            <div><div style="color:#00fff9;font-size:8px;letter-spacing:1px;">TIEMPO</div>
              <div style="color:#00ff00;font-size:18px;font-weight:bold;" id="_cy-s-time">0s</div></div>
          </div>
          <div style="margin-bottom:4px;color:#00fff9;font-size:8px;letter-spacing:1px;">
            PROGRESO <span id="_cy-s-prog">0/0</span>
          </div>
          <div class="cy-prog-wrap"><div class="cy-prog-fill" id="_cy-s-bar" style="width:0%"></div></div>
        </div>

        <!-- TERMINAL -->
        <div style="flex:1;display:flex;flex-direction:column;padding:10px 14px;min-height:0;overflow:hidden;">
          <div style="color:#00ff00;font-size:11px;margin-bottom:6px;flex-shrink:0;text-shadow:0 0 8px #00ff00;">
            ▸ TERMINAL
            <span style="float:right;display:flex;gap:4px;align-items:center;">
              <span style="width:7px;height:7px;background:#ff0000;border-radius:50%;display:inline-block;"></span>
              <span style="width:7px;height:7px;background:#ffff00;border-radius:50%;display:inline-block;"></span>
              <span style="width:7px;height:7px;background:#00ff00;border-radius:50%;display:inline-block;animation:pulse 2s infinite;"></span>
            </span>
          </div>
          <div id="_cy-term" style="flex:1;background:rgba(0,0,0,.9);border:1px solid #00ff00;
            padding:8px;overflow-y:auto;box-shadow:inset 0 0 20px rgba(0,255,0,.08);min-height:0;">
            <div class="cy-tl info">SISTEMA v4.0 INICIADO</div>
            <div class="cy-tl info">REQUESTS DIRECTAS — SIN DEPENDENCIA DOM</div>
          </div>
        </div>
      </div>

      <!-- PANEL DERECHO -->
      <div style="flex:1;display:flex;flex-direction:column;overflow:hidden;min-width:0;">
        <!-- toolbar -->
        <div style="padding:10px 14px;background:rgba(0,255,249,.04);border-bottom:1px solid rgba(0,255,249,.2);
          display:flex;gap:8px;align-items:center;flex-shrink:0;flex-wrap:wrap;">
          <div style="color:#ff00de;font-size:11px;white-space:nowrap;">▸ DATOS CAPTURADOS</div>
          <input class="cy-input" id="_cy-filtro" placeholder="FILTRAR..." style="flex:1;min-width:120px;">
          <button id="_cy-clear" class="cy-btn cy-btn-red" style="padding:5px 10px;font-size:10px;">🗑 LIMPIAR</button>
        </div>
        <!-- tabla -->
        <div style="flex:1;overflow:auto;min-height:0;">
          <table id="_cy-table">
            <thead><tr>
              <th>#</th><th>RIT</th><th>Tribunal</th><th>RUC</th>
              <th>Caratulado</th><th>Fecha</th><th>Estado</th>
              <th>Etapa</th><th>Litigantes</th><th>Relaciones / Delito</th>
              <th>Acción</th>
            </tr></thead>
            <tbody id="_cy-tbody">
              <tr><td colspan="11" style="padding:40px;text-align:center;color:#00fff9;opacity:.4;">
                <div style="font-size:32px;animation:pulse 2s infinite;">⚡</div>
                <div style="margin-top:8px;">ESPERANDO DATOS...</div>
              </td></tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  `;

  document.body.appendChild(root);

  // ════════════════════════════════════════════════════════════════
  // REFERENCIAS
  // ════════════════════════════════════════════════════════════════
  const $  = id => document.getElementById(id);
  const termEl   = $('_cy-term');
  const tbodyEl  = $('_cy-tbody');
  const barEl    = $('_cy-s-bar');
  const progEl   = $('_cy-s-prog');
  const btnRun   = $('_cy-run');
  const btnStop  = $('_cy-stop');
  const btnCSV   = $('_cy-csv');
  const btnJSON  = $('_cy-json');

  $('_cy-close').onclick = () => root.remove();

  // ════════════════════════════════════════════════════════════════
  // TERMINAL
  // ════════════════════════════════════════════════════════════════
  function tlog(msg, type = 'info') {
    const t = new Date().toLocaleTimeString();
    const el = document.createElement('div');
    el.className = `cy-tl ${type}`;
    el.textContent = `[${t}] ${msg}`;
    termEl.prepend(el);
    if (termEl.children.length > 300) termEl.lastChild.remove();
  }

  // ════════════════════════════════════════════════════════════════
  // ESTADO
  // ════════════════════════════════════════════════════════════════
  let _running = false, _results = [], _completados = 0, _activos = 0,
      _reintentos = 0, _detalles = 0, _timerStart = 0, _timerInterval = null;
  const sleep = ms => new Promise(r => setTimeout(r, ms));

  // ════════════════════════════════════════════════════════════════
  // RECAPTCHA
  // ════════════════════════════════════════════════════════════════
  async function getToken(action = 'consultaNombre') {
    return new Promise(resolve => {
      if (typeof grecaptcha === 'undefined') return resolve('');
      grecaptcha.ready(() => {
        grecaptcha.execute(RECAPTCHA_SITEKEY, { action })
          .then(t => resolve(t)).catch(() => resolve(''));
      });
    });
  }

  function detectarADIR() {
    const m = document.documentElement.innerHTML.match(/ADIR_\d+/);
    if (m) return m[0];
    // fallback scripts src
    for (const s of document.scripts) {
      const sm = (s.src || '').match(/ADIR_\d+/);
      if (sm) return sm[0];
    }
    return 'ADIR_871'; // fallback hardcodeado con warning
  }
  const ADIR = detectarADIR();
  tlog(`ADIR: ${ADIR}`, ADIR === 'ADIR_871' ? 'warn' : 'success');
  // ════════════════════════════════════════════════════════════════
  // REQUEST BÚSQUEDA
  // ════════════════════════════════════════════════════════════════
  async function queryTribunal(trib, nombre, apePat, apeMat, anio, pagToken) {
    const token = await getToken('consultaNombre');
    const params = new URLSearchParams({
      'g-recaptcha-response-nombre': token,
      'action':       'validate_captcha_nombre',
      'radio-group':  'N',
      nomNombre:      nombre,
      nomApePaterno:  apePat,
      nomApeMaterno:  apeMat,
      nomEra:         anio || '',
      nomNombreJur:   '',
      nomEraJur:      '',
      nomCompetencia: '5',
      nomTribunal:    trib.value,
      corteNom:       '0'
    });
    if (pagToken) { params.set('token', pagToken); params.set('registros', '5'); }

    return new Promise(resolve => {
      fetch(`https://oficinajudicialvirtual.pjud.cl/${ADIR}/penal/consultaNombrePenal.php`, {
        method: 'POST', credentials: 'include', mode: 'cors',
        headers: {
          'Accept': '*/*', 'Accept-Language': 'es-419,es;q=0.9',
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          'X-Requested-With': 'XMLHttpRequest',
          'sec-fetch-dest': 'empty', 'sec-fetch-mode': 'cors', 'sec-fetch-site': 'same-origin'
        },
        body: params.toString()
      })
      .then(r => r.text())
      .then(html => resolve({ ok: true, data: parsearBusqueda(html, trib) }))
      .catch(()  => resolve({ ok: false, data: null }));
    });
  }

  // ════════════════════════════════════════════════════════════════
  // REQUEST DETALLE
  // ════════════════════════════════════════════════════════════════
async function fetchDetalle(jwt) {
  const token = await getToken('validate_captcha_detcau_penal');
  const params = new URLSearchParams({ dtaCausa: jwt, tokenCaptcha: token });

  const html = await fetch(
    `https://oficinajudicialvirtual.pjud.cl/${ADIR}/penal/modal/causaPenal.php`,
    {
      method: 'POST', credentials: 'include', mode: 'cors',
      headers: {
        'Accept': '*/*',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'X-Requested-With': 'XMLHttpRequest',
        'sec-fetch-dest': 'empty', 'sec-fetch-mode': 'cors', 'sec-fetch-site': 'same-origin'
      },
      body: params.toString()
    }
  ).then(r => r.text()).catch(() => null);

  return html ? parsearDetalle(html) : null;
}


  // ════════════════════════════════════════════════════════════════
  // PARSER BÚSQUEDA
  // ════════════════════════════════════════════════════════════════
  function parsearBusqueda(html, trib) {
    if (html.trim().startsWith('<script>') && html.includes('parent.window.open'))
      return { causas: [], nextToken: null, error: true, sessionExpired: true };

    const doc = new DOMParser().parseFromString(
      `<table><tbody>${html}</tbody></table>`, 'text/html'
    );
    const causas = [];

    doc.querySelectorAll('tr').forEach(row => {
      const cells = row.querySelectorAll('td');
      if (cells.length !== 7) return;
      if (cells[0].hasAttribute('colspan')) return;
      const link = cells[0].querySelector('a');
      if (!link) return;
      const onclick = link.getAttribute('onClick') || link.getAttribute('onclick') || '';
      const jwt = onclick.match(/'(eyJ[^']+)'/)?.[1] || null;
      const rit = cells[1]?.textContent?.trim();
      if (!rit || rit === 'Rit' || rit === 'Rol') return;
      causas.push({
        rit,
        tribunal:      trib.label,
        ruc:           cells[3]?.textContent?.trim(),
        caratulado:    cells[4]?.textContent?.trim(),
        fecha_ingreso: cells[5]?.textContent?.trim(),
        estado:        cells[6]?.textContent?.trim(),
        jwt,
        detalle: null
      });
    });

    const nextToken = (
      doc.querySelector('#sigId')?.getAttribute('onclick') ||
      doc.querySelector('#sigId')?.getAttribute('onClick') || ''
    ).match(/'(eyJ[^']+)'/)?.[1] || null;

    return { causas, nextToken, error: false };
  }

  // ════════════════════════════════════════════════════════════════
  // PARSER DETALLE — extrae litigantes y relaciones del modal
  // ════════════════════════════════════════════════════════════════

function parsearDetalle(html) {
  const doc = new DOMParser().parseFromString(html, 'text/html');

  // ── Info general ─────────────────────────────────────────────
  let rit = '', ruc = '', fechaIngreso = '', estadoActual = '',
      etapa = '', formaInicio = '', caratulado = '', tribunal = '';

  doc.querySelectorAll('table.table-titulos td').forEach(td => {
    const txt = td.textContent.trim();
    const get = (key) => {
      const el = td.querySelector('strong');
      if (!el) return null;
      const label = el.textContent.trim();
      if (!label.startsWith(key)) return null;
      // valor = todo el texto del td menos el strong
      return txt.replace(label, '').trim().replace(/^:\s*/, '');
    };
    rit          = get('RIT')            || rit;
    ruc          = get('RUC')            || ruc;
    fechaIngreso = get('Fecha Ingreso')  || fechaIngreso;
    estadoActual = get('Estado Actual')  || estadoActual;
    etapa        = get('Etapa')          || etapa;
    formaInicio  = get('Forma Inicio')   || formaInicio;
    caratulado   = get('Caratulado')     || caratulado;
    tribunal     = get('Tribunal')       || tribunal;
  });

  // ── Litigantes — #litigantesPen ──────────────────────────────
  const litigantes = [];
  const litTab = doc.querySelector('#litigantesPen table');
  if (litTab) {
    litTab.querySelectorAll('tbody tr').forEach(row => {
      const cells = row.querySelectorAll('td');
      if (cells.length < 2) return;
      const tipo   = cells[0]?.textContent?.trim();
      const nombre = cells[1]?.textContent?.trim();
      const situacion = cells[2]?.textContent?.trim() || '';
      if (nombre) litigantes.push({ tipo, nombre, situacion });
    });
  }

  // ── Relaciones — #relacionesPen ──────────────────────────────
  const relaciones = [];
  const relTab = doc.querySelector('#relacionesPen table');
  if (relTab) {
    relTab.querySelectorAll('tbody tr').forEach(row => {
      const cells = row.querySelectorAll('td');
      if (cells.length < 4) return;
      relaciones.push({
        nombre:              cells[0]?.textContent?.trim(),
        delito:              cells[1]?.textContent?.trim(),
        estado_relacion:     cells[2]?.textContent?.trim(),
        fecha_cambio_estado: cells[3]?.textContent?.trim()
      });
    });
  }

  // ── Historia — #historiaPen ───────────────────────────────────
  const historia = [];
  const histTab = doc.querySelector('#historiaPen table');
  if (histTab) {
    histTab.querySelectorAll('tbody tr').forEach(row => {
      const cells = row.querySelectorAll('td');
      if (cells.length < 6) return;
      historia.push({
        tipo:               cells[2]?.textContent?.trim(),
        observacion:        cells[3]?.textContent?.trim(),
        fecha:              cells[4]?.textContent?.trim(),
        estado:             cells[5]?.textContent?.trim(),
        fecha_cambio_estado:cells[6]?.textContent?.trim() || ''
      });
    });
  }

  return { rit, ruc, fechaIngreso, estadoActual, etapa, formaInicio,
           caratulado, tribunal, litigantes, relaciones, historia };
}

  // ════════════════════════════════════════════════════════════════
  // REINTENTOS
  // ════════════════════════════════════════════════════════════════
  async function queryConReintentos(trib, nombre, apePat, apeMat, anio, pagToken, maxRetries, retryBase) {
    let intento = 0;
    while (intento <= maxRetries && _running) {
      const res = await queryTribunal(trib, nombre, apePat, apeMat, anio, pagToken);
      if (res.ok && !res.data.error) return res.data;
      intento++; _reintentos++;
      const isSession = res.ok && res.data?.sessionExpired;
      const wait = isSession ? 3000 + retryBase * Math.pow(2, intento-1) : retryBase * Math.pow(2, intento-1);
      tlog(`⚠ Reintento ${intento}/${maxRetries} — ${trib.label.substring(0,30)} ${isSession?'[captcha]':'[red]'}`, 'warn');
      if (intento <= maxRetries && _running) await sleep(wait);
    }
    tlog(`✗ Falló: ${trib.label.substring(0,35)}`, 'error');
    return { causas: [], nextToken: null, error: true };
  }

  // ════════════════════════════════════════════════════════════════
  // RENDER FILA — litigantes y relaciones inline
  // ════════════════════════════════════════════════════════════════
  function renderLitigantes(litigantes) {
    if (!litigantes?.length) return '<span class="cy-pending">—</span>';
    return litigantes.map(l => `
      <div class="cy-lit-item">
        <div class="cy-lit-tipo">${l.tipo}</div>
        <div class="cy-lit-nom">${l.nombre}</div>
      </div>`).join('');
  }

  function renderRelaciones(relaciones) {
    if (!relaciones?.length) return '<span class="cy-pending">—</span>';
    return relaciones.map(r => `
      <div class="cy-rel-item">
        <div class="cy-rel-delito">${r.delito}</div>
        <div class="cy-rel-nom">${r.nombre}</div>
        <div class="cy-rel-est">${r.estado_relacion} ${r.fecha_cambio_estado ? '· '+r.fecha_cambio_estado : ''}</div>
      </div>`).join('');
  }

  let _rowCount = 0;

  function agregarFila(c, idx) {
    _rowCount++;
    const concluida = (c.estado || '').toLowerCase().includes('concluida');
    const estadoPill = `<span class="cy-estado-pill ${concluida ? 'cy-concluida' : 'cy-activa'}">${c.estado}</span>`;
    const shortTrib = c.tribunal
      .replace(/Juzgado De (Letras Y )?Garantía De /i, '')
      .replace(/Tribunal De Juicio Oral En Lo Penal (De )?/i, 'TOP ');

    const tr = document.createElement('tr');
    tr.id = `_cy-row-${idx}`;
    tr.innerHTML = `
      <td style="color:#ff00de;text-align:center;">${_rowCount}</td>
      <td class="cy-rit">${c.rit}</td>
      <td class="cy-trib" title="${c.tribunal}">${shortTrib}</td>
      <td class="cy-ruc">${c.ruc}</td>
      <td class="cy-cara" title="${c.caratulado}">${c.caratulado}</td>
      <td class="cy-fecha">${c.fecha_ingreso}</td>
      <td>${estadoPill}</td>
      <td id="_cy-etapa-${idx}" class="cy-pending" style="font-size:9px;">—</td>
      <td id="_cy-lit-${idx}"   class="cy-pending" style="min-width:140px;">—</td>
      <td id="_cy-rel-${idx}"   class="cy-pending" style="min-width:160px;">—</td>
      <td style="text-align:center;">
        <button class="cy-btn cy-btn-cyan" style="padding:3px 8px;font-size:9px;"
          onclick="_cyVerDetalle(${idx})">VER</button>
      </td>
    `;

    // Si ya hay detalle (cargado asíncronamente), actualizar
    if (c.detalle) actualizarDetalleFila(idx, c.detalle);

    // Quitar placeholder si es la primera fila
    const placeholder = tbodyEl.querySelector('td[colspan]');
    if (placeholder) tbodyEl.innerHTML = '';

    tbodyEl.appendChild(tr);
  }

  function actualizarDetalleFila(idx, det) {
    const etapaEl = document.getElementById(`_cy-etapa-${idx}`);
    const litEl   = document.getElementById(`_cy-lit-${idx}`);
    const relEl   = document.getElementById(`_cy-rel-${idx}`);
    if (etapaEl) { etapaEl.className = ''; etapaEl.innerHTML = det.etapa || '—'; }
    if (litEl)   { litEl.className   = ''; litEl.innerHTML   = renderLitigantes(det.litigantes); }
    if (relEl)   { relEl.className   = ''; relEl.innerHTML   = renderRelaciones(det.relaciones); }
  }

  // Botón VER (JSON modal cyberpunk)
  window._cyVerDetalle = function(idx) {
    const c = _results[idx];
    if (!c) return;
    const overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,.92);z-index:1000001;display:flex;align-items:center;justify-content:center;';
    overlay.innerHTML = `
      <div style="background:linear-gradient(135deg,#0a0a0a,#1a0033);border:2px solid #00fff9;padding:24px;
        max-width:85vw;max-height:80vh;overflow-y:auto;box-shadow:0 0 40px rgba(0,255,249,.4);position:relative;">
        <h3 style="color:#00fff9;margin-bottom:12px;">📄 ${c.rit}</h3>
        <pre style="background:rgba(0,0,0,.8);padding:14px;border:1px solid #00fff9;color:#00ff00;font-size:10px;overflow-x:auto;white-space:pre-wrap;">${JSON.stringify(c, null, 2)}</pre>
        <button onclick="this.closest('div').parentNode.remove()"
          style="width:100%;margin-top:12px;padding:10px;background:transparent;border:2px solid #ff00de;color:#ff00de;cursor:pointer;font-family:'Share Tech Mono',monospace;">[X] CERRAR</button>
      </div>
    `;
    overlay.onclick = e => { if (e.target === overlay) overlay.remove(); };
    document.body.appendChild(overlay);
  };

  // ════════════════════════════════════════════════════════════════
  // POOL DE CONCURRENCIA
  // ════════════════════════════════════════════════════════════════
  async function runPool(tasks, concurrency) {
    let i = 0;
    async function worker() {
      while (i < tasks.length && _running) { await tasks[i++](); }
    }
    await Promise.all(Array.from({ length: concurrency }, worker));
  }

  // ════════════════════════════════════════════════════════════════
  // FILTRO
  // ════════════════════════════════════════════════════════════════
  $('_cy-filtro').addEventListener('input', function () {
    const f = this.value.toLowerCase();
    tbodyEl.querySelectorAll('tr').forEach(tr => {
      tr.style.display = tr.textContent.toLowerCase().includes(f) ? '' : 'none';
    });
  });

  $('_cy-clear').onclick = () => {
    if (!confirm('¿Borrar todos los datos?')) return;
    _results = []; _rowCount = 0;
    tbodyEl.innerHTML = `<tr><td colspan="11" style="padding:40px;text-align:center;color:#00fff9;opacity:.4;">
      <div style="font-size:32px;animation:pulse 2s infinite;">⚡</div><div>ESPERANDO DATOS...</div></td></tr>`;
    $('_cy-s-causas').textContent = '0';
    $('_cy-s-dets').textContent   = '0';
    tlog('DATOS ELIMINADOS', 'warn');
  };

  // ════════════════════════════════════════════════════════════════
  // EXPORTS
  // ════════════════════════════════════════════════════════════════
  function exportCSV() {
    if (!_results.length) return;
    const headers = [
      'RIT','Tribunal','RUC','Caratulado','Fecha Ingreso','Estado',
      'Etapa','Procedimiento',
      'Lit1 Tipo','Lit1 Nombre','Lit2 Tipo','Lit2 Nombre','Lit3 Tipo','Lit3 Nombre',
      'Rel1 Delito','Rel1 Nombre','Rel1 Estado','Rel1 Fecha',
      'Rel2 Delito','Rel2 Nombre','Rel2 Estado','Rel2 Fecha'
    ];
    const rows = _results.map(c => {
      const lit = c.detalle?.litigantes || [];
      const rel = c.detalle?.relaciones || [];
      return [
        c.rit, c.tribunal, c.ruc, c.caratulado, c.fecha_ingreso, c.estado,
        c.detalle?.etapa || '', c.detalle?.procedimiento || '',
        lit[0]?.tipo||'', lit[0]?.nombre||'',
        lit[1]?.tipo||'', lit[1]?.nombre||'',
        lit[2]?.tipo||'', lit[2]?.nombre||'',
        rel[0]?.delito||'', rel[0]?.nombre||'', rel[0]?.estado_relacion||'', rel[0]?.fecha_cambio_estado||'',
        rel[1]?.delito||'', rel[1]?.nombre||'', rel[1]?.estado_relacion||'', rel[1]?.fecha_cambio_estado||''
      ].map(v => `"${String(v ?? '').replace(/"/g,'""')}"`).join(',');
    });
    const blob = new Blob(['\uFEFF' + [headers.join(','), ...rows].join('\n')],
      { type: 'text/csv;charset=utf-8;' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `pjud_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    tlog('CSV EXPORTADO', 'success');
  }

  function exportJSON() {
    if (!_results.length) return;
    const blob = new Blob([JSON.stringify(_results, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `pjud_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    tlog('JSON EXPORTADO', 'success');
  }

  btnCSV.onclick  = exportCSV;
  btnJSON.onclick = exportJSON;

  // ════════════════════════════════════════════════════════════════
  // BÚSQUEDA PRINCIPAL
  // ════════════════════════════════════════════════════════════════
  btnRun.onclick = async function () {
    const nombre     = $('_cy-nom').value.trim().toUpperCase();
    const apePat     = $('_cy-pat').value.trim().toUpperCase();
    const apeMat     = $('_cy-mat').value.trim().toUpperCase();
    const anio       = $('_cy-anio').value.trim();
    const regionKey  = $('_cy-region').value;
    const deepScan   = $('_cy-deep').checked;
    const conc       = Math.min(parseInt($('_cy-conc').value) || 3, 25);
    const maxRetries = parseInt($('_cy-retries').value) || 5;
    const retryBase  = parseInt($('_cy-delay').value)   || 500;

    if (!nombre && !apePat) {
      alert('⚠ Ingresa al menos nombre o apellido paterno');
      return;
    }

    // Filtrar tribunales por región
    const tribunales = regionKey === 'all'
      ? TRIBUNALES_ALL
      : TRIBUNALES_ALL.filter(t => t.region === regionKey);

    if (!tribunales.length) {
      tlog('Sin tribunales para la región seleccionada', 'error');
      return;
    }

    // Reset
    _running = true; _results = []; _completados = 0; _activos = 0;
    _reintentos = 0; _detalles = 0; _rowCount = 0;
    tbodyEl.innerHTML = `<tr><td colspan="11" style="padding:30px;text-align:center;color:#00fff9;opacity:.4;">
      <div style="animation:pulse 1s infinite;font-size:24px;">⚡</div></td></tr>`;
    btnRun.style.display  = 'none';
    btnStop.style.display = 'block';
    btnCSV.style.display  = btnJSON.style.display = 'none';
    $('_cy-stats').style.display = 'block';
    $('_cy-s-causas').textContent = $('_cy-s-tribs').textContent =
    $('_cy-s-dets').textContent   = '0';
    barEl.style.width = '0%';

    _timerStart = Date.now();
    _timerInterval = setInterval(() => {
      const s = Math.floor((Date.now() - _timerStart) / 1000);
      $('_cy-s-time').textContent = s < 60 ? `${s}s` : `${Math.floor(s/60)}m${s%60}s`;
    }, 1000);

    tlog('═══════════════════════════════════', 'scan');
    tlog(`CYBER SCRAPER v4.0 — REQUEST DIRECTO`, 'scan');
    tlog(`OBJETIVO: ${nombre} ${apePat} ${apeMat}`, 'scan');
    tlog(`TRIBUNALES: ${tribunales.length} | REGIÓN: ${regionKey.toUpperCase()}`, 'info');
    tlog(`DEEP SCAN: ${deepScan ? 'ON' : 'OFF'} | CONCURRENCIA: ${conc}`, 'info');
    tlog('═══════════════════════════════════', 'scan');

    const total = tribunales.length;

    const tasks = tribunales.map(trib => async () => {
      if (!_running) return;
      _activos++;

      tlog(`→ SCAN: ${trib.label.substring(0, 45)}`, 'scan');

      let pagToken = null, pagina = 1;
      while (pagina <= 5 && _running) {
        const res = await queryConReintentos(trib, nombre, apePat, apeMat, anio, pagToken, maxRetries, retryBase);
        if (res.error || !res.causas.length) break;

        for (const c of res.causas) {
          const idx = _results.length;
          _results.push(c);
          agregarFila(c, idx);
          $('_cy-s-causas').textContent = _results.length;
          tlog(`✦ ${c.rit} — ${c.caratulado.substring(0, 40)}`, 'hit');

          // Deep scan inmediato por causa
          if (deepScan && c.jwt) {
            const det = await fetchDetalle(c.jwt);
            if (det) {
              c.detalle = det;
              _detalles++;
              $('_cy-s-dets').textContent = _detalles;
              actualizarDetalleFila(idx, det);
              const delito = det.relaciones[0]?.delito || '';
              tlog(`📋 ${c.rit} — ${delito.substring(0, 40) || 'OK'}`, 'success');
            }
            await sleep(300); // pequeño delay entre detalles
          }
        }

        if (!res.nextToken) break;
        pagToken = res.nextToken; pagina++;
      }

      _activos--;
      _completados++;
      const pct = Math.round((_completados / total) * 100);
      barEl.style.width = pct + '%';
      progEl.textContent = `${_completados}/${total}`;
      $('_cy-s-tribs').textContent = _completados;
    });

    await runPool(tasks, conc);

    clearInterval(_timerInterval);
    _running = false;
    btnStop.style.display = 'none';
    btnRun.style.display  = 'block';
    barEl.style.width = '100%';
    if (_results.length) {
      btnCSV.style.display  = 'inline-block';
      btnJSON.style.display = 'inline-block';
    }

    tlog('═══════════════════════════════════', 'success');
    tlog(`OPERACIÓN COMPLETADA`, 'success');
    tlog(`TOTAL: ${_results.length} CAUSAS | ${_detalles} DETALLES`, 'success');
    tlog('═══════════════════════════════════', 'success');
  };

  btnStop.onclick = () => {
    _running = false;
    tlog('⏹ OPERACIÓN ABORTADA', 'error');
  };

})();
