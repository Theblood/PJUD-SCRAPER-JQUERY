(function () {
  'use strict';

  if (typeof $ === 'undefined') {
    alert('❌ jQuery no está disponible');
    return;
  }

  // ============================================================
  //  CONFIG (mejoras de velocidad)
  // ============================================================
  const CFG = {
    // Turbo baja delays y timeouts (más rápido, pero si el sitio va lento puede fallar algún modal)
    turboDefault: true,

    // Delays base (se ajustan con Turbo)
    delay: {
      select: { turbo: 80, normal: 300 },          // después de cambiar tribunal
      afterLoad: { turbo: 160, normal: 450 },      // extraDelay post-loader para render tabla
      afterCloseModal: { turbo: 120, normal: 320 } // esperar tras cerrar modal
    },

    // Timeout por tribunal
    timeoutNombre: { turbo: 25000, normal: 30000 },

    // Límite de detalles por tribunal (0 = ninguno / 10 recomendado / 9999 = todos)
    maxDetallesDefault: 10,

    // Render “liviano” mientras corre (evita HTML pesado si no hay detalle)
    liteRender: true
  };

  // ============================================================
  //  ESTILOS CYBERPUNK
  // ============================================================
  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');
    * { box-sizing: border-box; }

    @keyframes glitch {
      0% { text-shadow: 2px 2px #ff00de, -2px -2px #00fff9; }
      25% { text-shadow: -2px 2px #ff00de, 2px -2px #00fff9; }
      50% { text-shadow: 2px -2px #ff00de, -2px 2px #00fff9; }
      75% { text-shadow: -2px -2px #ff00de, 2px 2px #00fff9; }
      100% { text-shadow: 2px 2px #ff00de, -2px -2px #00fff9; }
    }
    @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }

    .terminal-line{
      color:#00ff00;font-family:'Share Tech Mono', monospace;font-size:11px;margin:2px 0;padding:3px 8px;
      text-shadow:0 0 5px #00ff00;border-left:2px solid transparent;transition:all .3s;word-wrap:break-word;
    }
    .terminal-line:hover{background:rgba(0,255,0,.1);border-left-color:#00ff00;}
    .terminal-line::before{content:'> ';color:#ff00de;font-weight:bold;}

    .terminal-line.scan{color:#ff00de;text-shadow:0 0 10px #ff00de;}
    .terminal-line.success{color:#00ff00;text-shadow:0 0 10px #00ff00;}
    .terminal-line.error{color:#ff0000;text-shadow:0 0 10px #ff0000;}
    .terminal-line.warning{color:#ffff00;text-shadow:0 0 10px #ffff00;}
    .terminal-line.info{color:#00fff9;text-shadow:0 0 10px #00fff9;}

    #cyber-terminal::-webkit-scrollbar, .cyber-scroll::-webkit-scrollbar{width:8px;}
    #cyber-terminal::-webkit-scrollbar-track, .cyber-scroll::-webkit-scrollbar-track{
      background:rgba(0,0,0,.5);border:1px solid #00ff00;
    }
    #cyber-terminal::-webkit-scrollbar-thumb, .cyber-scroll::-webkit-scrollbar-thumb{
      background:#00ff00;box-shadow:0 0 10px #00ff00;
    }

    @media (max-width: 1200px){#cyber-panel-left{width:400px !important;}}
    @media (max-width: 900px){
      #cyber-container-main{flex-direction:column !important;}
      #cyber-panel-left{
        width:100% !important;border-right:none !important;border-bottom:2px solid #00fff9 !important;max-height:40vh;
      }
      #cyber-panel-right{width:100% !important;}
      .cyber-stats-grid{grid-template-columns:repeat(4,1fr) !important;}
    }
    @media (max-width: 600px){
      .cyber-header h2{font-size:18px !important;}
      .cyber-stats-grid{grid-template-columns:repeat(2,1fr) !important;}
      #cyber-tabla{font-size:9px !important;}
    }
  `;
  $('<style>').text(styles).appendTo('head');

  // ============================================================
  //  UI PANEL
  // ============================================================
  const panel = $(`
    <div id="scraper-cyber" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: linear-gradient(135deg, #0a0a0a 0%, #1a0033 100%); z-index: 999999; font-family: 'Share Tech Mono', monospace; display: flex; flex-direction: column; overflow: hidden;">
      <div class="cyber-header" style="padding: 12px 20px; background: linear-gradient(90deg, rgba(0, 255, 249, 0.15) 0%, rgba(255, 0, 222, 0.15) 100%); border-bottom: 2px solid #00fff9; display: flex; justify-content: space-between; align-items: center; flex-shrink: 0; box-shadow: 0 2px 20px rgba(0, 255, 249, 0.3);">
        <div>
          <h2 style="margin: 0; color: #00fff9; font-size: 22px; text-shadow: 0 0 20px #00fff9; animation: glitch 3s infinite;">⚡ CYBER SCRAPER v3.0 ⚡</h2>
          <div style="color: #ff00de; font-size: 10px; margin-top: 3px;">SISTEMA DE BÚSQUEDA JUDICIAL AVANZADO</div>
        </div>
        <button id="btn-cerrar-cyber" style="background: transparent; border: 2px solid #ff00de; color: #ff00de; padding: 8px 16px; cursor: pointer; font-family: 'Share Tech Mono', monospace; font-size: 13px; text-shadow: 0 0 10px #ff00de; transition: all 0.3s;"
          onmouseover="this.style.background='#ff00de'; this.style.color='#000';"
          onmouseout="this.style.background='transparent'; this.style.color='#ff00de';">[X] CERRAR</button>
      </div>

      <div id="cyber-container-main" style="display: flex; flex: 1; overflow: hidden;">
        <div id="cyber-panel-left" style="width: 450px; border-right: 2px solid #00fff9; display: flex; flex-direction: column; background: rgba(0, 0, 0, 0.5); overflow: hidden;">
          <div style="padding: 15px; flex-shrink: 0; border-bottom: 1px solid #00fff9; overflow-y: auto; max-height: 45vh;" class="cyber-scroll">

            <div style="margin-bottom: 10px;">
              <label style="color: #00fff9; font-size: 10px; display: block; margin-bottom: 3px;">▸ NOMBRE</label>
              <input type="text" id="cyber-nombre" placeholder="Juan"
                style="width: 100%; padding: 6px; background: rgba(0, 0, 0, 0.8); border: 1px solid #00fff9; color: #00fff9; font-family: 'Share Tech Mono', monospace; font-size: 11px;">
            </div>

            <div style="margin-bottom: 10px;">
              <label style="color: #00fff9; font-size: 10px; display: block; margin-bottom: 3px;">▸ APELLIDO PATERNO</label>
              <input type="text" id="cyber-ap-paterno" placeholder="González"
                style="width: 100%; padding: 6px; background: rgba(0, 0, 0, 0.8); border: 1px solid #00fff9; color: #00fff9; font-family: 'Share Tech Mono', monospace; font-size: 11px;">
            </div>

            <div style="margin-bottom: 10px;">
              <label style="color: #00fff9; font-size: 10px; display: block; margin-bottom: 3px;">▸ APELLIDO MATERNO</label>
              <input type="text" id="cyber-ap-materno" placeholder="Silva"
                style="width: 100%; padding: 6px; background: rgba(0, 0, 0, 0.8); border: 1px solid #00fff9; color: #00fff9; font-family: 'Share Tech Mono', monospace; font-size: 11px;">
            </div>

            <div style="margin-bottom: 10px;">
              <label style="color: #00fff9; font-size: 10px; display: block; margin-bottom: 3px;">▸ REGIÓN</label>
              <select id="cyber-region"
                style="width: 100%; padding: 6px; background: rgba(0, 0, 0, 0.8); border: 1px solid #00fff9; color: #00fff9; font-family: 'Share Tech Mono', monospace; font-size: 11px;">
                <option value="all">TODAS (Chile completo)</option>
                <option value="rm">Región Metropolitana</option>
                <option value="valpo">Valparaíso</option>
                <option value="coq">Coquimbo</option>
                <option value="antof">Antofagasta</option>
                <option value="tar">Tarapacá</option>
                <option value="arica">Arica y Parinacota</option>
                <option value="atac">Atacama</option>
                <option value="ohig">O’Higgins</option>
                <option value="maule">Maule</option>
                <option value="nuble">Ñuble</option>
                <option value="bio">Biobío</option>
                <option value="arau">La Araucanía</option>
                <option value="losrios">Los Ríos</option>
                <option value="loslagos">Los Lagos</option>
                <option value="aysen">Aysén</option>
                <option value="mag">Magallanes</option>
                <option value="rapa">Rapa Nui (Isla de Pascua)</option>
              </select>
            </div>

            <div style="margin-bottom: 10px; display:flex; gap:10px; align-items:center;">
              <label style="color:#ff00de; cursor:pointer; font-size:10px; user-select:none;">
                <input type="checkbox" id="cyber-turbo" style="margin-right:6px;">MODO TURBO
              </label>

              <div style="flex:1;">
                <label style="color:#00fff9; font-size:10px; display:block; margin-bottom:3px;">▸ MAX DETALLES / TRIBUNAL (0 = ninguno)</label>
                <input type="number" id="cyber-max-det" min="0" step="1"
                  style="width: 100%; padding: 6px; background: rgba(0, 0, 0, 0.8); border: 1px solid #00fff9; color: #00fff9; font-family: 'Share Tech Mono', monospace; font-size: 11px;">
              </div>
            </div>

            <div style="margin-bottom: 10px;">
              <label style="color: #ff00de; cursor: pointer; font-size: 10px;">
                <input type="checkbox" id="cyber-todos" checked style="margin-right: 6px;">
                ESCANEAR TODOS LOS TRIBUNALES (filtra por región si corresponde)
              </label>
            </div>

            <div style="margin-bottom: 10px;">
              <label style="color: #ff00de; cursor: pointer; font-size: 10px;">
                <input type="checkbox" id="cyber-detalles" checked style="margin-right: 6px;">
                EXTRACCIÓN PROFUNDA [DEEP SCAN]
              </label>
            </div>

            <button id="btn-iniciar-cyber"
              style="width: 100%; padding: 10px; background: linear-gradient(135deg, #00fff9 0%, #ff00de 100%); border: none; color: #000; font-family: 'Share Tech Mono', monospace; font-size: 13px; font-weight: bold; cursor: pointer; box-shadow: 0 0 20px rgba(0, 255, 249, 0.5); margin-bottom: 6px;">
              ⚡ INICIAR BÚSQUEDA ⚡
            </button>

            <button id="btn-detener-cyber"
              style="width: 100%; padding: 10px; background: transparent; border: 2px solid #ff0000; color: #ff0000; font-family: 'Share Tech Mono', monospace; font-size: 13px; cursor: pointer; display: none; margin-bottom: 6px;">
              ⏹ ABORTAR OPERACIÓN
            </button>

            <div style="display: flex; gap: 6px;">
              <button id="btn-export-excel-cyber" style="flex: 1; padding: 7px; background: rgba(33, 115, 70, 0.3); border: 1px solid #217346; color: #00ff00; font-family: 'Share Tech Mono', monospace; font-size: 10px; cursor: pointer; display: none;">📊 EXCEL</button>
              <button id="btn-export-json-cyber" style="flex: 1; padding: 7px; background: rgba(255, 165, 0, 0.3); border: 1px solid #ffa500; color: #ffa500; font-family: 'Share Tech Mono', monospace; font-size: 10px; cursor: pointer; display: none;">📥 JSON</button>
            </div>
          </div>

          <div id="cyber-stats" style="padding: 12px 15px; background: rgba(0, 255, 249, 0.05); border-bottom: 1px solid #00fff9; flex-shrink: 0; display: none;">
            <div class="cyber-stats-grid" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; margin-bottom: 8px;">
              <div><div style="color: #00fff9; font-size: 8px;">CAUSAS</div><div style="color: #00ff00; font-size: 16px; font-weight: bold;" id="stat-causas-cyber">0</div></div>
              <div><div style="color: #00fff9; font-size: 8px;">TRIBUNALES</div><div style="color: #00ff00; font-size: 16px; font-weight: bold;" id="stat-tribunales-cyber">0</div></div>
              <div><div style="color: #00fff9; font-size: 8px;">DETALLES</div><div style="color: #00ff00; font-size: 16px; font-weight: bold;" id="stat-detalles-cyber">0</div></div>
              <div><div style="color: #00fff9; font-size: 8px;">TIEMPO</div><div style="color: #00ff00; font-size: 16px; font-weight: bold;" id="stat-tiempo-cyber">0s</div></div>
            </div>
            <div>
              <div style="color: #00fff9; font-size: 8px; margin-bottom: 3px;">PROGRESO: <span id="progreso-texto-cyber">0/0</span></div>
              <div style="height: 12px; background: rgba(0, 0, 0, 0.5); border: 1px solid #00fff9; overflow: hidden;">
                <div id="progreso-barra-cyber" style="height: 100%; width: 0%; background: linear-gradient(90deg, #00fff9 0%, #ff00de 100%); transition: width 0.3s;"></div>
              </div>
            </div>
          </div>

          <div style="flex: 1; display: flex; flex-direction: column; overflow: hidden; padding: 12px 15px; min-height: 0;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; flex-shrink: 0;">
              <div style="color: #00ff00; font-size: 12px; text-shadow: 0 0 10px #00ff00;">▸ TERMINAL DE SISTEMA</div>
              <div style="display: flex; gap: 4px;">
                <div style="width: 8px; height: 8px; background: #ff0000; border-radius: 50%;"></div>
                <div style="width: 8px; height: 8px; background: #ffff00; border-radius: 50%;"></div>
                <div style="width: 8px; height: 8px; background: #00ff00; border-radius: 50%; animation: pulse 2s infinite;"></div>
              </div>
            </div>

            <div id="cyber-terminal" style="flex: 1; background: rgba(0, 0, 0, 0.9); border: 2px solid #00ff00; padding: 10px; overflow-y: auto; box-shadow: inset 0 0 30px rgba(0, 255, 0, 0.1); min-height: 0;">
              <div class="terminal-line info">SISTEMA INICIADO</div>
              <div class="terminal-line info">ESPERANDO COMANDOS...</div>
            </div>
          </div>
        </div>

        <div id="cyber-panel-right" style="flex: 1; display: flex; flex-direction: column; overflow: hidden; min-width: 0;">
          <div style="padding: 12px 15px; background: rgba(0, 255, 249, 0.05); border-bottom: 1px solid #00fff9; display: flex; gap: 8px; align-items: center; flex-shrink: 0; flex-wrap: wrap;">
            <div style="color: #ff00de; font-size: 12px; white-space: nowrap;">▸ DATOS CAPTURADOS</div>
            <input type="text" id="cyber-filtro" placeholder="FILTRAR..." style="flex: 1; min-width: 150px; padding: 6px; background: rgba(0, 0, 0, 0.8); border: 1px solid #00fff9; color: #00fff9; font-family: 'Share Tech Mono', monospace; font-size: 11px;">
            <button id="btn-limpiar-cyber" style="padding: 6px 12px; background: rgba(255, 0, 0, 0.2); border: 1px solid #ff0000; color: #ff0000; font-family: 'Share Tech Mono', monospace; cursor: pointer; font-size: 10px;">🗑 LIMPIAR</button>
          </div>

          <div style="flex: 1; overflow: auto; min-height: 0;" class="cyber-scroll">
            <table id="cyber-tabla" style="width: 100%; border-collapse: collapse; font-size: 10px;">
              <thead style="position: sticky; top: 0; background: linear-gradient(135deg, rgba(0, 255, 249, 0.2) 0%, rgba(255, 0, 222, 0.2) 100%); z-index: 10;">
                <tr>
                  <th style="padding: 8px; border: 1px solid #00fff9; color: #00fff9;">#</th>
                  <th style="padding: 8px; border: 1px solid #00fff9; color: #00fff9;">RIT</th>
                  <th style="padding: 8px; border: 1px solid #00fff9; color: #00fff9;">RUC</th>
                  <th style="padding: 8px; border: 1px solid #00fff9; color: #00fff9;">TRIBUNAL</th>
                  <th style="padding: 8px; border: 1px solid #00fff9; color: #00fff9;">CARATULADO</th>
                  <th style="padding: 8px; border: 1px solid #00fff9; color: #00fff9;">ESTADO</th>
                  <th style="padding: 8px; border: 1px solid #00fff9; color: #00fff9;">FECHA</th>
                  <th style="padding: 8px; border: 1px solid #00fff9; color: #00fff9;">ETAPA</th>
                  <th style="padding: 8px; border: 1px solid #00fff9; color: #00fff9;">LITIGANTES</th>
                  <th style="padding: 8px; border: 1px solid #00fff9; color: #00fff9;">RELACIONES</th>
                  <th style="padding: 8px; border: 1px solid #00fff9; color: #00fff9;">ACCIÓN</th>
                </tr>
              </thead>
              <tbody id="cyber-tabla-body">
                <tr>
                  <td colspan="11" style="padding: 40px; text-align: center; color: #00fff9; opacity: 0.5;">
                    <div style="font-size: 36px; margin-bottom: 15px; animation: pulse 2s infinite;">⚡</div>
                    <div>ESPERANDO DATOS...</div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  `);

  $('body').append(panel);

  // defaults UI
  $('#cyber-turbo').prop('checked', CFG.turboDefault);
  $('#cyber-max-det').val(CFG.maxDetallesDefault);

  // ============================================================
  //  STATE
  // ============================================================
  let detenido = false;
  let todasLasCausas = [];
  let tiempoInicio = 0;
  let intervaloTiempo = null;
  let contadorCausas = 0;

  // ============================================================
  //  HELPERS
  // ============================================================
  function terminalLog(msg, tipo = 'info') {
    const time = new Date().toLocaleTimeString();
    $('#cyber-terminal').prepend(`<div class="terminal-line ${tipo}">[${time}] ${msg}</div>`);
    const lines = $('#cyber-terminal .terminal-line');
    if (lines.length > 200) lines.slice(200).remove();
    console.log(`[${tipo.toUpperCase()}] ${msg}`);
  }

  function actualizarStats() {
    const seg = Math.floor((Date.now() - tiempoInicio) / 1000);
    const min = Math.floor(seg / 60);
    const s = seg % 60;
    $('#stat-tiempo-cyber').text(min > 0 ? `${min}m ${s}s` : `${s}s`);
  }

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  function selectBootstrapSelect(selector, value) {
    const $s = $(selector);
    $s.val(value);
    if ($s.data('selectpicker')) {
      $s.selectpicker('val', value);
      $s.selectpicker('refresh');
    }
    $s.trigger('change').trigger('changed.bs.select');
  }

  // ============================================================
  //  REGIÓN: normalizador + keywords + filtro
  // ============================================================
  function normTxt(s) {
    return (s || '')
      .toString()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
  }

  const REGION_KEYWORDS = {
    rm: ['santiago', 'colina', 'puente alto', 'san bernardo', 'melipilla', 'curacavi', 'talagante'],
    valpo: [
      'valparaiso', 'vina del mar', 'quilpue', 'san antonio', 'casablanca', 'la ligua',
      'san felipe', 'quillota', 'limache', 'la calera', 'los andes', 'villa alemana',
      'quintero', 'petorca', 'putaendo'
    ],
    coq: ['la serena', 'coquimbo', 'vicuna', 'ovalle', 'illapel', 'andacollo', 'combarbala', 'los vilos'],
    antof: ['antofagasta', 'calama', 'tocopilla', 'mejillones', 'maria elena', 'taltal'],
    tar: ['iquique', 'pozo almonte', 'alto hospicio'],
    arica: ['arica'],
    atac: ['copiapo', 'vallenar', 'caldera', 'chanaral', 'diego de almagro', 'freirina'],
    ohig: [
      'rancagua', 'san fernando', 'santa cruz', 'rengo', 'graneros', 'peumo',
      'pichilemu', 'litueche', 'peralillo', 'san vicente', 'tagua-tagua'
    ],
    maule: ['talca', 'curico', 'linares', 'cauquenes', 'molina', 'constitucion', 'san javier', 'parral', 'chanco', 'curepto', 'licanten'],
    nuble: ['chillan', 'san carlos', 'yungay', 'bulnes', 'coelemu', 'quirihue'],
    bio: [
      'concepcion', 'talcahuano', 'tome', 'coronel', 'chiguayante', 'san pedro de la paz',
      'arauco', 'canete', 'lebu', 'curanilahue', 'lota', 'los angeles', 'nacimiento',
      'laja', 'yumbel', 'cabrero', 'mulchen', 'santa barbara', 'florida', 'santa juana'
    ],
    arau: [
      'temuco', 'angol', 'villarrica', 'victoria', 'pitrufquen', 'nueva imperial', 'lautaro',
      'loncoche', 'pucon', 'carahue', 'curacautin', 'collipulli', 'traiguen', 'puren', 'tolten'
    ],
    losrios: ['valdivia', 'mariquina', 'los lagos', 'paillaco', 'la union', 'rio bueno', 'panguipulli'],
    loslagos: [
      'osorno', 'puerto montt', 'puerto montt.', 'puerto varas', 'castro', 'ancud', 'calbuco', 'maullin',
      'quellon', 'los muermos', 'achao', 'chaiten', 'hualaihue', 'rio negro'
    ],
    aysen: ['coyhaique', 'puerto aysen', 'cochrane', 'chile chico', 'cisnes'],
    mag: ['punta arenas', 'puerto natales', 'porvenir', 'cabo de hornos'],
    rapa: ['isla de pascua']
  };

  function filtrarTribunalesPorRegion(tribunales, regionKey) {
    if (!regionKey || regionKey === 'all') return tribunales;
    const keys = REGION_KEYWORDS[regionKey] || [];
    if (!keys.length) return tribunales;
    return tribunales.filter(t => {
      const txt = normTxt(t.text);
      return keys.some(k => txt.includes(k));
    });
  }

  // ============================================================
  //  ESPERAR CARGA (NOMBRE)
  // ============================================================
  async function esperarCargaNombre({ timeout = 30000, extraDelay = 450 } = {}) {
    const inicio = Date.now();
    terminalLog('ESPERANDO RESPUESTA DEL SERVIDOR (NOMBRE)...', 'info');

    return new Promise((resolve) => {
      let done = false;
      let obs = null;

      const finish = (ok) => {
        if (done) return;
        done = true;
        if (obs) obs.disconnect();
        clearInterval(poll);
        clearTimeout(tmr);

        if (!ok) return resolve(false);
        setTimeout(() => resolve(true), extraDelay);
      };

      const check = () => {
        const t = Date.now() - inicio;
        if (t >= timeout) {
          terminalLog('TIMEOUT - SIN RESPUESTA (NOMBRE)', 'warning');
          return finish(false);
        }

        const $loader = $('#loadPreNombre');
        const loaderVacio = (!$loader.length) || (($loader.html() || '').trim() === '');

        const $target = $('#verDetalleNombre');
        const targetText = ($target.text() || '').toLowerCase();
        const tieneMensajeNoRes = targetText.includes('no se han encontrado resultados');
        const tieneFilas = $target.find('tr').length > 0;

        if (loaderVacio && (tieneFilas || tieneMensajeNoRes)) {
          terminalLog('DATOS RECIBIDOS (NOMBRE)', 'success');
          return finish(true);
        }
      };

      const $target = $('#verDetalleNombre');
      if ($target.length && window.MutationObserver) {
        obs = new MutationObserver(check);
        obs.observe($target[0], { childList: true, subtree: true, characterData: true });
      }

      const poll = setInterval(check, 120);
      const tmr = setTimeout(check, timeout);

      check();
    });
  }

  // ============================================================
  //  MODAL DETALLE
  // ============================================================
  async function esperarModal(timeout = 15000) {
    const inicio = Date.now();
    return new Promise((resolve) => {
      const checkInterval = setInterval(() => {
        const $modal = $('#modalDetallePenal');
        const t = Date.now() - inicio;

        if ($modal.is(':visible') && $modal.find('table.table-titulos').length > 0) {
          clearInterval(checkInterval);
          resolve(true);
        } else if (t >= timeout) {
          clearInterval(checkInterval);
          resolve(false);
        }
      }, 200);
    });
  }

  async function extractModalDetail() {
    const cargado = await esperarModal();
    if (!cargado) return null;

    const $modal = $('#modalDetallePenal');

    try {
      const detalle = {
        informacion_general: {},
        litigantes: [],
        relaciones: [],
        esta_reservada: false
      };

      if ($modal.find('.panel-default h4 p').text().toLowerCase().includes('reservada')) {
        detalle.esta_reservada = true;
        return detalle;
      }

      $modal.find('table.table-titulos').first().find('tbody tr td').each(function () {
        const txt = $(this).text().trim();
        if (txt.includes('RIT :')) detalle.informacion_general.rit = txt.replace('RIT :', '').trim();
        else if (txt.includes('RUC :')) detalle.informacion_general.ruc = txt.replace('RUC :', '').trim();
        else if (txt.includes('Fecha Ingreso:')) detalle.informacion_general.fecha_ingreso = txt.replace('Fecha Ingreso:', '').trim();
        else if (txt.includes('Estado Actual:')) detalle.informacion_general.estado_actual = txt.replace('Estado Actual:', '').trim();
        else if (txt.includes('Etapa:')) detalle.informacion_general.etapa = txt.replace('Etapa:', '').trim();
        else if (txt.includes('Forma Inicio:')) detalle.informacion_general.forma_inicio = txt.replace('Forma Inicio:', '').trim();
      });

      $modal.find('#litigantesPen table tbody tr').each(function () {
        const c = $(this).find('td');
        if (c.length >= 2) {
          detalle.litigantes.push({
            tipo: $(c[0]).text().trim(),
            nombre: $(c[1]).text().trim(),
            situacion_libertad: $(c[2]).text().trim()
          });
        }
      });

      $modal.find('#relacionesPen table tbody tr').each(function () {
        const c = $(this).find('td');
        if (c.length >= 3) {
          detalle.relaciones.push({
            nombre: $(c[0]).text().trim(),
            delito: $(c[1]).text().trim(),
            estado_relacion: $(c[2]).text().trim(),
            fecha_cambio_estado: $(c[3]).text().trim()
          });
        }
      });

      return detalle;
    } catch {
      return null;
    }
  }

  // ============================================================
  //  EXTRAER TABLA (NOMBRE) desde #verDetalleNombre
  // ============================================================
  function extractTableDataNombre() {
    const causas = [];
    const $tbody = $('#verDetalleNombre');
    if (!$tbody.length) return causas;

    const texto = ($tbody.text() || '').toLowerCase();
    if (texto.includes('no se han encontrado resultados')) return causas;

    $tbody.find('tr').each(function () {
      const $row = $(this);
      const c = $row.find('td');
      if (c.length < 7) return;

      const $link = $row.find('a.toggle-modal, a[data-target="#modalDetallePenal"], a[data-toggle="modal"]').first();

      const causa = {
        rit: $(c[1]).text().trim(),
        tribunal: $(c[2]).text().trim(),
        ruc: $(c[3]).text().trim(),
        caratulado: $(c[4]).text().trim(),
        fecha_ingreso: $(c[5]).text().trim(),
        estado: $(c[6]).text().trim(),
        tiene_detalle: $link.length > 0
      };

      if ($link.length > 0) causa._linkDetalle = $link;
      if (causa.rit && causa.ruc) causas.push(causa);
    });

    return causas;
  }

  // ============================================================
  //  RENDER helpers (lite)
  // ============================================================
  function renderLitigantes(detalle) {
    const litigantes = detalle?.litigantes || [];
    if (!litigantes.length) return '<span style="color:#666;font-size:9px;">-</span>';

    return litigantes.map(l => `
      <div style="margin-bottom: 4px; padding: 2px; background: rgba(0, 255, 249, 0.1); border-left: 2px solid #00fff9; font-size: 9px;">
        <div style="color: #ff00de;">${l.tipo || ''}</div>
        <div style="color: #00fff9;">${l.nombre || ''}</div>
      </div>
    `).join('');
  }

  function renderRelaciones(detalle) {
    const relaciones = detalle?.relaciones || [];
    if (!relaciones.length) return '<span style="color:#666;font-size:9px;">-</span>';

    return relaciones.map(r => `
      <div style="margin-bottom: 4px; padding: 3px; background: rgba(255, 0, 222, 0.1); border-left: 2px solid #ff00de; font-size: 9px;">
        <div style="color: #ff00de; font-weight: bold;">${r.delito || ''}</div>
        <div style="color: #00fff9;">${r.nombre || ''}</div>
        <div style="color: #00ff00; font-size: 8px;">${r.estado_relacion || ''}</div>
      </div>
    `).join('');
  }

  function renderEtapa(detalle) {
    const etapa = detalle?.informacion_general?.etapa;
    return etapa ? etapa : '-';
  }

  // ============================================================
  //  TABLA UI (optimizada: fila liviana y update posterior)
  // ============================================================
  function agregarFilaTabla(causa, displayIndex, arrIndex, { placeholder = true } = {}) {
    const estado = String(causa.estado || '');

    const estadoBadge = `
      <span style="padding:2px 6px; background:${estado.includes('Ingresada') ? 'rgba(0,255,0,.2)' : 'rgba(255,165,0,.2)'};
        color:${estado.includes('Ingresada') ? '#00ff00' : '#ffa500'}; font-size:8px; border-radius:2px;">
        ${causa.estado || ''}
      </span>
    `;

    const pend = '<span style="color:#666;font-size:9px;">(pendiente)</span>';
    const lite = CFG.liteRender;

    const etapaHTML = placeholder ? (lite ? pend : '-') : renderEtapa(causa.detalle);
    const litHTML = placeholder ? (lite ? pend : '-') : renderLitigantes(causa.detalle);
    const relHTML = placeholder ? (lite ? pend : '-') : renderRelaciones(causa.detalle);

    const row = $(`
      <tr id="cyber-row-${arrIndex}" style="border-bottom: 1px solid rgba(0, 255, 249, 0.2); transition: all 0.3s; background: rgba(0, 255, 249, 0.3);">
        <td style="padding: 6px; border: 1px solid rgba(0, 255, 249, 0.2); color: #ff00de; text-align: center;">${displayIndex}</td>
        <td style="padding: 6px; border: 1px solid rgba(0, 255, 249, 0.2); color: #00fff9; font-weight: bold;">${causa.rit || ''}</td>
        <td style="padding: 6px; border: 1px solid rgba(0, 255, 249, 0.2); color: #00ff00; font-family: monospace; font-size: 9px;">${causa.ruc || ''}</td>
        <td style="padding: 6px; border: 1px solid rgba(0, 255, 249, 0.2); color: #00fff9; font-size: 9px;">${causa.tribunal || ''}</td>
        <td style="padding: 6px; border: 1px solid rgba(0, 255, 249, 0.2); color: #fff;">${causa.caratulado || ''}</td>
        <td style="padding: 6px; border: 1px solid rgba(0, 255, 249, 0.2);">${estadoBadge}</td>
        <td style="padding: 6px; border: 1px solid rgba(0, 255, 249, 0.2); color: #00fff9;">${causa.fecha_ingreso || ''}</td>

        <td class="cyber-etapa" style="padding: 6px; border: 1px solid rgba(0, 255, 249, 0.2); color: #fff; font-size: 9px;">${etapaHTML}</td>
        <td class="cyber-lit" style="padding: 6px; border: 1px solid rgba(0, 255, 249, 0.2); max-width: 180px;">${litHTML}</td>
        <td class="cyber-rel" style="padding: 6px; border: 1px solid rgba(0, 255, 249, 0.2); max-width: 200px;">${relHTML}</td>

        <td style="padding: 6px; border: 1px solid rgba(0, 255, 249, 0.2); text-align: center;">
          <button class="btn-ver-cyber" data-arrindex="${arrIndex}"
            style="background: transparent; border: 1px solid #00fff9; color: #00fff9; padding: 4px 8px; cursor: pointer; font-family: 'Share Tech Mono', monospace; font-size: 9px;">VER</button>
        </td>
      </tr>
    `);

    if ($('#cyber-tabla-body tr td[colspan]').length > 0) $('#cyber-tabla-body').empty();
    $('#cyber-tabla-body').append(row);

    setTimeout(() => row.css('background', 'rgba(0, 0, 0, 0.3)'), 700);
  }

  function actualizarFilaDetalle(arrIndex) {
    const causa = todasLasCausas[arrIndex];
    if (!causa) return;

    const $row = $(`#cyber-row-${arrIndex}`);
    if (!$row.length) return;

    $row.find('.cyber-etapa').html(renderEtapa(causa.detalle));
    $row.find('.cyber-lit').html(renderLitigantes(causa.detalle));
    $row.find('.cyber-rel').html(renderRelaciones(causa.detalle));
  }

  // ============================================================
  //  MODAL "VER" (JSON)
  // ============================================================
  $(document).on('click', '.btn-ver-cyber', function () {
    const arrIndex = Number($(this).data('arrindex'));
    const causa = todasLasCausas[arrIndex];

    if (!causa) {
      terminalLog(`ERROR: Registro no encontrado (arrIndex=${arrIndex})`, 'error');
      alert('⚠ No se pudo abrir el registro (índice inválido).');
      return;
    }

    $('body').append(`
      <div id="modal-overlay-cyber" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.9); z-index: 999999;"></div>
      <div id="modal-box-cyber" style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: linear-gradient(135deg, #0a0a0a 0%, #1a0033 100%); padding: 25px; border: 3px solid #00fff9; box-shadow: 0 0 50px rgba(0, 255, 249, 0.5); z-index: 1000000; max-width: 90vw; max-height: 80vh; overflow-y: auto; font-family: 'Share Tech Mono', monospace;" class="cyber-scroll">
        <h3 style="color: #00fff9; margin-top: 0;">📄 ${causa.rit || '(sin RIT)'}</h3>
        <pre style="background: rgba(0, 0, 0, 0.8); padding: 15px; border: 1px solid #00fff9; color: #00ff00; font-size: 10px; overflow-x: auto;">${JSON.stringify(causa, null, 2)}</pre>
        <button id="cerrar-modal-cyber" style="width: 100%; padding: 10px; background: transparent; border: 2px solid #ff00de; color: #ff00de; font-family: 'Share Tech Mono', monospace; cursor: pointer; margin-top: 12px;">[X] CERRAR</button>
      </div>
    `);

    $('#cerrar-modal-cyber, #modal-overlay-cyber').on('click', function () {
      $('#modal-box-cyber').remove();
      $('#modal-overlay-cyber').remove();
    });
  });

  // ============================================================
  //  FILTRO + LIMPIAR
  // ============================================================
  $('#cyber-filtro').on('input', function () {
    const f = ($(this).val() || '').toLowerCase();
    $('#cyber-tabla-body tr').each(function () {
      $(this).toggle($(this).text().toLowerCase().includes(f));
    });
  });

  $('#btn-limpiar-cyber').click(function () {
    if (!confirm('¿CONFIRMAR?')) return;

    $('#cyber-tabla-body').html(`
      <tr><td colspan="11" style="padding: 40px; text-align: center; color: #00fff9; opacity: 0.5;">
        <div style="font-size: 36px;">⚡</div><div>ESPERANDO DATOS...</div>
      </td></tr>
    `);

    todasLasCausas = [];
    contadorCausas = 0;
    $('#stat-causas-cyber').text('0');
    $('#stat-detalles-cyber').text('0');
    terminalLog('DATOS ELIMINADOS', 'warning');
  });

  // ============================================================
  //  EXPORTS
  // ============================================================
  $('#btn-export-excel-cyber').click(function () {
    if (!todasLasCausas.length) return alert('SIN DATOS');

    terminalLog('GENERANDO CSV...', 'info');

    let csv = 'RIT,RUC,Tribunal,Caratulado,Estado,Fecha,Etapa,';
    csv += 'Lit1 Tipo,Lit1 Nombre,Lit2 Tipo,Lit2 Nombre,';
    csv += 'Rel1 Delito,Rel1 Nombre,Rel1 Estado,Rel2 Delito,Rel2 Nombre,Rel2 Estado\n';

    todasLasCausas.forEach(c => {
      const info = c.detalle?.informacion_general || {};
      const lit = c.detalle?.litigantes || [];
      const rel = c.detalle?.relaciones || [];

      const row = [
        c.rit, c.ruc, c.tribunal, c.caratulado, c.estado, c.fecha_ingreso, info.etapa || '',
        lit[0]?.tipo || '', lit[0]?.nombre || '', lit[1]?.tipo || '', lit[1]?.nombre || '',
        rel[0]?.delito || '', rel[0]?.nombre || '', rel[0]?.estado_relacion || '',
        rel[1]?.delito || '', rel[1]?.nombre || '', rel[1]?.estado_relacion || ''
      ].map(f => `"${String(f ?? '').replace(/"/g, '""')}"`).join(',');

      csv += row + '\n';
    });

    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `causas_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();

    terminalLog('CSV GENERADO', 'success');
  });

  $('#btn-export-json-cyber').click(function () {
    if (!todasLasCausas.length) return alert('SIN DATOS');

    terminalLog('GENERANDO JSON...', 'info');

    const blob = new Blob([JSON.stringify(todasLasCausas, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `causas_${new Date().toISOString().split('T')[0]}.json`;
    link.click();

    terminalLog('JSON GENERADO', 'success');
  });

  // ============================================================
  //  CERRAR / DETENER
  // ============================================================
  $('#btn-cerrar-cyber').click(() => {
    if (intervaloTiempo) clearInterval(intervaloTiempo);
    panel.remove();
  });

  $('#btn-detener-cyber').click(() => {
    detenido = true;
    terminalLog('OPERACIÓN ABORTADA', 'error');
  });

  // ============================================================
  //  PROCESO PRINCIPAL (optimizado)
  // ============================================================
  $('#btn-iniciar-cyber').click(async function () {
    const nombre = $('#cyber-nombre').val().trim();
    const apPaterno = $('#cyber-ap-paterno').val().trim();
    const apMaterno = $('#cyber-ap-materno').val().trim();

    const regionKey = $('#cyber-region').val() || 'all';
    const buscarTodos = $('#cyber-todos').is(':checked');
    const extraerDetalles = $('#cyber-detalles').is(':checked');

    const turbo = $('#cyber-turbo').is(':checked');

    const maxDetalles = Math.max(0, parseInt($('#cyber-max-det').val(), 10) || 0);

    const DELAY_SELECT = turbo ? CFG.delay.select.turbo : CFG.delay.select.normal;
    const EXTRA_DELAY_RENDER = turbo ? CFG.delay.afterLoad.turbo : CFG.delay.afterLoad.normal;
    const DELAY_CERRAR_MODAL = turbo ? CFG.delay.afterCloseModal.turbo : CFG.delay.afterCloseModal.normal;

    const TIMEOUT_NOMBRE = turbo ? CFG.timeoutNombre.turbo : CFG.timeoutNombre.normal;

    if (!nombre && !apPaterno && !apMaterno) return alert('⚠ INGRESA AL MENOS UN CAMPO');

    detenido = false;
    $(this).hide();
    $('#btn-detener-cyber').show();
    $('#btn-export-excel-cyber, #btn-export-json-cyber').hide();
    $('#cyber-stats').show();

    tiempoInicio = Date.now();
    intervaloTiempo = setInterval(actualizarStats, 1000);

    terminalLog('═══════════════════════════════════════', 'scan');
    terminalLog(`INICIANDO SISTEMA DE BÚSQUEDA v3.0 ${turbo ? '[TURBO]' : ''}`, 'scan');
    terminalLog('═══════════════════════════════════════', 'scan');

    try {
      terminalLog('ACCEDIENDO AL SISTEMA...', 'info');
      $('a[href="#BusNombre"]').click();
      await sleep(turbo ? 300 : 900);

      terminalLog('CONFIGURANDO COMPETENCIA PENAL...', 'info');
      selectBootstrapSelect('#nomCompetencia', '5');
      await sleep(turbo ? 250 : 700);

      terminalLog('CARGANDO TRIBUNALES...', 'info');
      let tribunales = [];

      if (buscarTodos) {
        const $t = $('#nomTribunal');
        let intentos = 0;
        while ($t.find('option').length <= 1 && intentos < 30) {
          await sleep(200);
          intentos++;
        }

        $t.find('option').each(function () {
          const v = $(this).val();
          const tx = $(this).text().trim();
          if (v && v !== '0' && tx && tx !== 'Seleccione Tribunal...' && tx !== 'Selecione Tribunal...') {
            tribunales.push({ value: v, text: tx });
          }
        });

        terminalLog(`${tribunales.length} TRIBUNALES CARGADOS`, 'success');

        const antes = tribunales.length;
        tribunales = filtrarTribunalesPorRegion(tribunales, regionKey);
        terminalLog(`FILTRO REGIÓN: ${String(regionKey).toUpperCase()} => ${tribunales.length}/${antes} TRIBUNALES`, 'info');

        if (regionKey !== 'all' && tribunales.length === 0) {
          terminalLog('ADVERTENCIA: 0 tribunales tras el filtro (ajusta keywords si falta alguno).', 'warning');
        }
      } else {
        tribunales.push({ value: '', text: 'GLOBAL' });
        terminalLog('MODO: GLOBAL (sin recorrer lista de tribunales)', 'info');
      }

      let totalDet = 0;
      const nc = [nombre, apPaterno, apMaterno].filter(Boolean).join(' ');
      terminalLog(`OBJETIVO: ${nc.toUpperCase()}`, 'scan');
      terminalLog(`DEEP SCAN: ${extraerDetalles ? 'ON' : 'OFF'} | MAX DET/TRIB: ${extraerDetalles ? maxDetalles : 0}`, 'info');
      terminalLog('INICIANDO ESCANEO...', 'scan');

      for (let j = 0; j < tribunales.length; j++) {
        if (detenido) {
          terminalLog('OPERACIÓN CANCELADA', 'error');
          break;
        }

        const trib = tribunales[j];
        const prog = ((j + 1) / tribunales.length * 100).toFixed(1);

        $('#progreso-texto-cyber').text(`${j + 1}/${tribunales.length}`);
        $('#progreso-barra-cyber').css('width', prog + '%');
        terminalLog(`SCAN [${j + 1}/${tribunales.length}]: ${trib.text}`, 'scan');

        if (trib.value) {
          selectBootstrapSelect('#nomTribunal', trib.value);
          await sleep(DELAY_SELECT);
        }

        $('#nomNombre').val(nombre);
        $('#nomApePaterno').val(apPaterno);
        $('#nomApeMaterno').val(apMaterno);

        // limpiar para no leer HTML viejo
        if ($('#verDetalleNombre').length) $('#verDetalleNombre').empty();

        // click consulta
        $('#btnConConsultaNom').click();

        // esperar loader vacío + tabla cargada
        const cargado = await esperarCargaNombre({
          timeout: TIMEOUT_NOMBRE,
          extraDelay: EXTRA_DELAY_RENDER
        });

        if (!cargado) {
          terminalLog('TIMEOUT EN ESTE TRIBUNAL', 'warning');
          continue;
        }

        const causas = extractTableDataNombre();

        if (causas.length === 0) {
          terminalLog('SIN RESULTADOS EN ESTE TRIBUNAL', 'warning');
          $('#stat-tribunales-cyber').text(j + 1);
          continue;
        }

        terminalLog(`${causas.length} CAUSAS ENCONTRADAS`, 'success');

        // 1) Primero agregamos todas las filas “livianas” rápido
        // 2) Luego hacemos deep scan solo a las primeras maxDetalles (por tribunal)
        const startIndexArr = todasLasCausas.length;

        for (let i = 0; i < causas.length; i++) {
          const causa = causas[i];

          // guardamos y pintamos rápido
          todasLasCausas.push(causa);
          contadorCausas++;

          const arrIndex = todasLasCausas.length - 1;
          agregarFilaTabla(causa, contadorCausas, arrIndex, { placeholder: extraerDetalles && maxDetalles > 0 });

          $('#stat-causas-cyber').text(contadorCausas);
        }

        terminalLog(`REGISTROS AGREGADOS: +${causas.length}`, 'success');

        // Deep scan controlado (por tribunal)
        if (extraerDetalles && maxDetalles > 0) {
          let detHechos = 0;

          for (let i = 0; i < causas.length; i++) {
            if (detenido) break;
            if (detHechos >= maxDetalles) break;

            const arrIndex = startIndexArr + i;
            const causa = todasLasCausas[arrIndex];
            if (!causa || !causa._linkDetalle) continue;

            terminalLog(`DEEP SCAN: ${causa.rit}`, 'info');
            causa._linkDetalle.click();

            const det = await extractModalDetail();

            if (!det) {
              terminalLog(`DETALLE NO DISPONIBLE: ${causa.rit}`, 'warning');
            } else {
              causa.detalle = det;
              totalDet++;
              $('#stat-detalles-cyber').text(totalDet);

              // update fila (muestra detalle en la tabla)
              actualizarFilaDetalle(arrIndex);

              terminalLog(`DETALLE OK: ${causa.rit} (lit=${det.litigantes?.length || 0}, rel=${det.relaciones?.length || 0})`, 'success');
              if (det.relaciones?.length > 0) terminalLog(`RELACIONES: ${det.relaciones.length}`, 'warning');
            }

            // cerrar modal
            $('#modalDetallePenal').modal('hide');
            await sleep(DELAY_CERRAR_MODAL);

            delete causa._linkDetalle;
            detHechos++;
          }

          if (detHechos < causas.length) {
            terminalLog(`DEEP SCAN: ${detHechos}/${causas.length} (limitado por MAX DET/TRIB)`, 'info');
          }
        } else {
          // si no hay deep scan, sacamos referencia al link para que no pese export/json
          for (let i = 0; i < causas.length; i++) {
            const arrIndex = startIndexArr + i;
            if (todasLasCausas[arrIndex]) delete todasLasCausas[arrIndex]._linkDetalle;
          }
        }

        $('#stat-tribunales-cyber').text(j + 1);
      }

      if (intervaloTiempo) clearInterval(intervaloTiempo);
      actualizarStats();

      terminalLog('═══════════════════════════════════════', 'success');
      terminalLog('OPERACIÓN COMPLETADA', 'success');
      terminalLog(`TOTAL: ${contadorCausas} REGISTROS`, 'success');
      terminalLog('═══════════════════════════════════════', 'success');

      $('#btn-export-excel-cyber, #btn-export-json-cyber').show();
    } catch (error) {
      terminalLog(`ERROR: ${error && error.message ? error.message : String(error)}`, 'error');
      if (intervaloTiempo) clearInterval(intervaloTiempo);
    } finally {
      $('#btn-detener-cyber').hide();
      $('#btn-iniciar-cyber').show();
    }
  });

  terminalLog('SISTEMA LISTO v3.0', 'success');
  terminalLog('ESPERANDO COMANDOS...', 'info');
})();
