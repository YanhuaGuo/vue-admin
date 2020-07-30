import Stats from "../jsm/libs/stats.module.js";
import { drawThreeGeo, drawModel, drawLine } from "./threeGeoJSON";
import {util} from './util';

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.GIO = {})));
}(this, (function (exports) { 'use strict';

global.THREE = require("three");

/**
 * @author syt123450 / https://github.com/syt123450
 */

/**
 * The StyleFactory will persist all pre-defined style, and return style object to ConfigureHandler by a given name
 */

var StyleFactory = ( function () {

    var styleMap = {};

    // get style API for ConfigureHandler to get a specific style object by name

    function getStyle ( styleName ) {

        return styleMap[ styleName ];

    }

    //register API for style creator

    function register( styleName, style ) {

        styleMap[ styleName ] = style;

    }

    return {

        getStyle: getStyle,

        register: register

    }

}() );

/**
 * @author syt123450 / https://github.com/syt123450
 */

// Developer can adjust and define their own style like this, and contribute to our repository

var MagicStyle = ( function () {

    return {

        color: {

            surface: 0xff0000,

            selected: 0x0000ff,

            in: 0x154492,

            out: 0xdd380c,

            halo: 0x00ff00,

            background: 0x222222
        },

        brightness: {

            ocean: 0.5,

            mentioned: 0.5,

            related: 0.5
        }

    }

}() );

/**
 * @author Qi Liu / https://github.com/lq3297401
 */

var MintStyle = ( function () {

    return {

        color: {

            surface: 0x4BB007,

            selected: 0x59E37D,

            in: 0x7CFC56,

            out: 0x2E92AB,

            halo: 0xBDFFC8,

            background: 0x000000
        },

        brightness: {

            ocean: 0.5,

            mentioned: 0.5,

            related: 0.5
        }

    }

}() );

/**
 * @author Qi Liu / https://github.com/lq3297401
 */

var RedBlueStyle = ( function () {

    return {

        color: {

            surface: 0x7E0BB0,

            selected: 0xFF8000,

            in: 0xFF0000,

            out: 0x0A85CC,

            halo: 0x0883FF,

            background: 0x000000
        },

        brightness: {

            ocean: 0.5,

            mentioned: 0.5,

            related: 0.5
        }

    }

}() );

/**
 * @author Qi Liu / https://github.com/lq3297401
 */

var StrawberryStyle = ( function () {

    return {

        color: {

            surface: 0xB066A6,

            selected: 0xE2717C,

            in: 0xFFFFFF,

            out: 0xE20000,

            halo: 0xFF5E5E,

            background: 0x000000
        },

        brightness: {

            ocean: 0.5,

            mentioned: 0.5,

            related: 0.5
        }

    }

}() );

/**
 * @author Qi Liu / https://github.com/lq3297401
 */

var SunsetStyle = ( function () {

    return {

        color: {

            surface: 0x9F04B0,

            selected: 0xE3DF62,

            in: 0xFF7803,

            out: 0xE20000,

            halo: 0xFFB60A,

            background: 0x000000
        },

        brightness: {

            ocean: 0.5,

            mentioned: 0.5,

            related: 0.5
        }

    }

}() );

/**
 * @author Qi Liu / https://github.com/lq3297401
 */

var NearMoonStyle = ( function () {

    return {

        color: {

            surface: 0x9C63D4,

            selected: 0x913DFF,

            in: 0x8A6AD4,

            out: 0x3486E4,

            halo: 0x3BCBFF,

            background: 0x000000
        },

        brightness: {

            ocean: 0.5,

            mentioned: 0.5,

            related: 0.5
        }

    }

}() );

/**
 * @author Qi Liu / https://github.com/lq3297401
 */

var LemonGateStyle = ( function () {

    return {

        color: {

            surface: 0x9C63D4,

            selected: 0x913DFF,

            in: 0x8A6AD4,

            out: 0x3486E4,

            halo: 0x3BCBFF,

            background: 0x000000
        },

        brightness: {

            ocean: 0.5,

            mentioned: 0.5,

            related: 0.5
        }

    }

}() );

/**
 * @author Qi Liu / https://github.com/lq3297401
 */

var JuicyCakeStyle = ( function () {

    return {

        color: {

            surface: 0xCE26D4,

            selected: 0xE8F000,

            in: 0xF7BB2F,

            out: 0xE155AB,

            halo: 0xF9A6FF,

            background: 0x000000
        },

        brightness: {

            ocean: 0.5,

            mentioned: 0.5,

            related: 0.5
        }

    }

}() );

/**
 * @author Qi Liu / https://github.com/lq3297401
 */

var GorgeousDreamStyle = ( function () {

    return {

        color: {

            surface: 0x7828D4,

            selected: 0x527CF0,

            in: 0xCC208E,

            out: 0x3126D2,

            halo: 0x7A6BFF,

            background: 0x000000
        },

        brightness: {

            ocean: 0.5,

            mentioned: 0.5,

            related: 0.5
        }

    }

}() );

/**
 * @author syt123450 / https://github.com/syt123450
 */

// developer need to register their new style to StyleFactory here

StyleFactory.register( "magic", MagicStyle );

StyleFactory.register( "mint", MintStyle );

StyleFactory.register( "redBlue", RedBlueStyle );

StyleFactory.register( "strawberry", StrawberryStyle );

StyleFactory.register( "sunset", SunsetStyle );

StyleFactory.register( "nearMoon", NearMoonStyle );

StyleFactory.register( "lemonGate", LemonGateStyle );

StyleFactory.register( "juicyCake", JuicyCakeStyle );

StyleFactory.register( "gorgeousDream", GorgeousDreamStyle );

/**
 * @author syt123450 / https://github.com/syt123450
 * @author Botime / https://github.com/BoTime
 */

/**
 * This is a singleton object.
 * When getting picked clicked color, the surfaceHandler will lookup the clicked country through this map.
 */

var CountryColorMap = ( function () {

    return {

        '1': 'PE',
        '2': 'BF',
        '3': 'FR',
        '4': 'LY',
        '5': 'BY',
        '6': 'PK',
        '7': 'ID',
        '8': 'YE',
        '9': 'MG',
        '10': 'BO',
        '11': 'CI',
        '12': 'DZ',
        '13': 'CH',
        '14': 'CM',
        '15': 'MK',
        '16': 'BW',
        '17': 'UA',
        '18': 'KE',
        '19': 'TW',
        '20': 'JO',
        '21': 'MX',
        '22': 'AE',
        '23': 'BZ',
        '24': 'BR',
        '25': 'SL',
        '26': 'ML',
        '27': 'CD',
        '28': 'IT',
        '29': 'SO',
        '30': 'AF',
        '31': 'BD',
        '32': 'DO',
        '33': 'GW',
        '34': 'GH',
        '35': 'AT',
        '36': 'SE',
        '37': 'TR',
        '38': 'UG',
        '39': 'MZ',
        '40': 'JP',
        '41': 'NZ',
        '42': 'CU',
        '43': 'VE',
        '44': 'PT',
        '45': 'CO',
        '46': 'MR',
        '47': 'AO',
        '48': 'DE',
        '49': 'SD',
        '50': 'TH',
        '51': 'AU',
        '52': 'PG',
        '53': 'IQ',
        '54': 'HR',
        '55': 'GL',
        '56': 'NE',
        '57': 'DK',
        '58': 'LV',
        '59': 'RO',
        '60': 'ZM',
        '61': 'IR',
        '62': 'MM',
        '63': 'ET',
        '64': 'GT',
        '65': 'SR',
        '66': 'EH',
        '67': 'CZ',
        '68': 'TD',
        '69': 'AL',
        '70': 'FI',
        '71': 'SY',
        '72': 'KG',
        '73': 'SB',
        '74': 'OM',
        '75': 'PA',
        '76': 'AR',
        '77': 'GB',
        '78': 'CR',
        '79': 'PY',
        '80': 'GN',
        '81': 'IE',
        '82': 'NG',
        '83': 'TN',
        '84': 'PL',
        '85': 'NA',
        '86': 'ZA',
        '87': 'EG',
        '88': 'TZ',
        '89': 'GE',
        '90': 'SA',
        '91': 'VN',
        '92': 'RU',
        '93': 'HT',
        '94': 'BA',
        '95': 'IN',
        '96': 'CN',
        '97': 'CA',
        '98': 'SV',
        '99': 'GY',
        '100': 'BE',
        '101': 'GQ',
        '102': 'LS',
        '103': 'BG',
        '104': 'BI',
        '105': 'DJ',
        '106': 'AZ',
        '107': 'MY',
        '108': 'PH',
        '109': 'UY',
        '110': 'CG',
        '111': 'RS',
        '112': 'ME',
        '113': 'EE',
        '114': 'RW',
        '115': 'AM',
        '116': 'SN',
        '117': 'TG',
        '118': 'ES',
        '119': 'GA',
        '120': 'HU',
        '121': 'MW',
        '122': 'TJ',
        '123': 'KH',
        '124': 'KR',
        '125': 'HN',
        '126': 'IS',
        '127': 'NI',
        '128': 'CL',
        '129': 'MA',
        '130': 'LR',
        '131': 'NL',
        '132': 'CF',
        '133': 'SK',
        '134': 'LT',
        '135': 'ZW',
        '136': 'LK',
        '137': 'IL',
        '138': 'LA',
        '139': 'KP',
        '140': 'GR',
        '141': 'TM',
        '142': 'EC',
        '143': 'BJ',
        '144': 'SI',
        '145': 'NO',
        '146': 'MD',
        '147': 'LB',
        '148': 'NP',
        '149': 'ER',
        '150': 'US',
        '151': 'KZ',
        '152': 'AQ',
        '153': 'SZ',
        '154': 'UZ',
        '155': 'MN',
        '156': 'BT',
        '157': 'NC',
        '158': 'FJ',
        '159': 'KW',
        '160': 'TL',
        '161': 'BS',
        '162': 'VU',
        '163': 'FK',
        '164': 'GM',
        '165': 'QA',
        '166': 'JM',
        '167': 'CY',
        '168': 'PR',
        '169': 'PS',
        '170': 'BN',
        '171': 'TT',
        '172': 'CV',
        '173': 'PF',
        '174': 'WS',
        '175': 'LU',
        '176': 'KM',
        '177': 'MU',
        '178': 'FO',
        '179': 'ST',
        '181': 'DM',
        '182': 'TO',
        '183': 'KI',
        '184': 'FM',
        '185': 'BH',
        '186': 'AD',
        '187': 'MP',
        '188': 'PW',
        '189': 'SC',
        '190': 'AG',
        '191': 'BB',
        '192': 'TC',
        '193': 'VC',
        '194': 'LC',
        '195': 'YT',
        '196': 'VI',
        '197': 'GD',
        '198': 'MT',
        '199': 'MV',
        '200': 'KY',
        '201': 'KN',
        '202': 'MS',
        '203': 'BL',
        '204': 'NU',
        '205': 'PM',
        '206': 'CK',
        '207': 'WF',
        '208': 'AS',
        '209': 'MH',
        '210': 'AW',
        '211': 'LI',
        '212': 'VG',
        '213': 'SH',
        '214': 'JE',
        '215': 'AI',
        '217': 'GG',
        '218': 'SM',
        '219': 'BM',
        '220': 'TV',
        '221': 'NR',
        '222': 'GI',
        '223': 'PN',
        '224': 'MC',
        '225': 'VA',
        '226': 'IM',
        '227': 'GU',
        '228': 'SG'

    };

}() );

/**
 * @author syt123450 / https://github.com/syt123450
 * @author mokuteno / https://github.com/manymeeting
 */

/**
 * it contains static function, the functions will be called by other component in whole project.
 * The stateless function can be added here.
 */

var Utils = ( function () {

    function isString( str ) {

        return ( typeof str === 'string' ) && str.constructor === String;

    }

    function transformStringToHex( str ) {

        if ( str.charAt( 0 ) !== "#" ) {

            return null;

        }

        return parseInt( str.substring( 1 ), 16 );

    }

    function formatHexColor( color ) {

        if ( color < 0 || color > 16777215 ) {

            return null;

        }

        return color;

    }

    function getElementViewTop ( element ){

        var actualTop = element.offsetTop;
        var current = element.offsetParent;
    
        while ( current !== null ) {

            actualTop += current.offsetTop;
            current = current.offsetParent;

        }

        var elementScrollTop;

        if ( document.compatMode === "BackCompat" ) {

            elementScrollTop = document.body.scrollTop;

	    } else {

            if ( document.documentElement.scrollTop === 0 ) {

                elementScrollTop = document.body.scrollTop;

	        } else {

                elementScrollTop = document.documentElement.scrollTop;

            }

        }

        return actualTop - elementScrollTop;

    }

    function getElementViewLeft ( element ) {

        var actualLeft = element.offsetLeft;
        var current = element.offsetParent;
        
        while ( current !== null ) {

            actualLeft += current.offsetLeft;
            current = current.offsetParent;

        }

        var elementScrollLeft;

	    if ( document.compatMode === "BackCompat" ) {

	        elementScrollLeft = document.body.scrollLeft;

        } else {

            if ( document.documentElement.scrollTop === 0 ) {

                elementScrollLeft = document.body.scrollLeft;

            } else {

                elementScrollLeft = document.documentElement.scrollLeft;

            }

        }

        return actualLeft - elementScrollLeft;

    }

    function isArray( value ) {

        return Array.isArray( value );

    }


    return {

        // temporarily constrain value to ( -Math.PI, Math.PI )

        wrap: function ( value, min, range ) {

            range -= min;

            while ( value < min ) {

                value += range;

            }

            return value % range;

        },

        // constrain the value in a range

        constrain: function ( v, min, max ) {

            if ( v < min ) {

                v = min;

            } else if ( v > max ) {

                v = max;

            }

            return v;

        },

        // format code to hex type (the input may "#000000" or 0x000000)

        formatColor: function ( color ) {

            if ( isString( color ) ) {

                return transformStringToHex( color );

            } else {

                return formatHexColor( color );

            }

        },

        // transform brightness from user's input (0 - 1) to (min - max)

        transformBrightness: function ( brightness, min, max ) {

            if ( brightness > 1 ) {

                return max;

            }

            if ( brightness < 0 ) {

                return min;

            }

            return Math.floor( min + ( max - min ) * brightness );

        },

        // deep clone an object from a country data, add more information for user's callback

        transformCountryData: function ( countryData ) {

            var outputData = {};

            outputData.name = countryData.name;
            outputData.lat = countryData.lat;
            outputData.lon = countryData.lon;
            outputData.center = countryData.center.clone();
            outputData.ISOCode = CountryColorMap[ countryData.colorCode ];

            return outputData;

        },

        /**
        * Flatten country data based on given min and max value.
        *
        * @param {Array} data
        *   An array of data to be processed.
        *   Example: [
        *      {
        *        "e": "CN",
        *        "i": "US",
        *        "v": 3300000
        *      },
        *      {
        *        "e": "CN",
        *        "i": "RU",
        *        "v": 10000
        *      }
        *    ]
        * @param {string} valueKey
        * @param {number} definedMin
        * @param {number} definedMax
        */

        flattenCountryData: function ( data, valueKey, definedMin, definedMax ) {
            if ( data.length === 0 )
                return;
    
            var values = data.map( function ( countryData ) {
                return countryData[ valueKey ];
            });
            var min = Math.min.apply( null, values );
            var max = Math.max.apply( null, values );
            
            data.forEach( function ( country ) {

                var v = country[ valueKey ];

                if (( max - min ) !== 0) {
                    country[ valueKey ] = ( v - min ) * ( definedMax - definedMin ) / ( max - min ) + definedMin;
                }

            } );

        },

        getElementViewTop: getElementViewTop,

        getElementViewLeft: getElementViewLeft,

		isArray: isArray

    };

}() );

/**
 * @author syt123450 / https://github.com/syt123450
 */

/**
 * This handlers handle all task related to the earth surface.
 */

function SurfaceHandler ( controller ) {

    var highlightColor = 255;

    var oceanMin = 0, oceanMax = 20;
    var mentionedMin = 50, mentionedMax = 100;
    var relatedMin = 100, relatedMax = 150;

    // this function return a color code range in (0 - 255) from a clicked area on the screen

    function getPickColor ( mouseX, mouseY ) {

        // first need to hide above layer and shows the map_index image

        var ctx = controller.earthSurfaceShader.lookupCanvas.getContext( '2d' );
        ctx.clearRect( 0, 0, 256, 1 );

        var oceanFill = 0;
        ctx.fillStyle = 'rgb(' + oceanFill + ',' + oceanFill + ',' + oceanFill +')';
        ctx.fillRect( 0, 0, 1, 1 );

        controller.earthSurfaceShader.uniforms[ 'outlineLevel' ].value = 0;
        controller.earthSurfaceShader.uniforms[ 'flag' ].value = 0;

        controller.rotating.remove( controller.visualizationMesh );

        controller.earthSurfaceShader.lookupTexture.needsUpdate = true;

        controller.renderer.autoClear = false;
        controller.renderer.autoClearColor = false;
        controller.renderer.autoClearDepth = false;
        controller.renderer.autoClearStencil = false;

        controller.renderer.clear();
        controller.renderer.render( controller.scene, controller.camera );

        var gl = controller.renderer.context;
        gl.preserveDrawingBuffer = true;

        var mx = ( mouseX + controller.renderer.context.canvas.width / 2 );
        var my = ( -mouseY + controller.renderer.context.canvas.height / 2 );
        mx = Math.floor( mx );
        my = Math.floor( my );

        // picked color from map_index image

        var buf = new Uint8Array( 4 );
        gl.readPixels( mx, my, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, buf );

        // restore the above layer

        controller.renderer.autoClear = true;
        controller.renderer.autoClearColor = true;
        controller.renderer.autoClearDepth = true;
        controller.renderer.autoClearStencil = true;

        gl.preserveDrawingBuffer = false;

        controller.earthSurfaceShader.uniforms[ 'outlineLevel' ].value = 1;
        controller.earthSurfaceShader.uniforms[ 'flag' ].value = 1;
        console.log('visualizationMesh');
console.log(controller.visualizationMesh)
        controller.rotating.add( controller.visualizationMesh );

        highlightCountry( controller.selectedCountry.colorCode );

        return buf[ 0 ];

    }

    // this function highlight the surface

    function highlightCountry ( code ) {

        var i;

        // clear the surface

        var ctx = controller.earthSurfaceShader.lookupCanvas.getContext( '2d' );
        ctx.clearRect( 0, 0, 256, 1 );

        // highlight ocean

        ctx.fillStyle = generateFillStyle( Utils.transformBrightness( controller.configure.brightness.ocean, oceanMin, oceanMax ) );        
        console.log(ctx.fillStyle);
        ctx.fillRect( 0, 0, 1, 1 );

        // highlight mentioned countries

        if ( controller.configure.control.lightenMentioned ) {

            ctx.fillStyle = generateFillStyle(
                Utils.transformBrightness( controller.configure.brightness.mentioned, mentionedMin, mentionedMax )
            );

            for ( i in controller.mentionedCountryCodes ) {

                ctx.fillRect( controller.mentionedCountryCodes[ i ], 0, 1, 1 );

            }

        }

        // highlight related countries

        ctx.fillStyle = generateFillStyle(
            Utils.transformBrightness( controller.configure.brightness.related, relatedMin, relatedMax )
        );

        for ( i in controller.relatedCountries ) {

            ctx.fillRect( controller.relatedCountries[ i ].colorCode, 0, 1, 1 );

        }

        // highlight clicked country
        console.log('code')
        console.log(code)
        ctx.fillStyle = generateFillStyle( highlightColor );
        ctx.fillRect( code, 0, 1, 1 );
        console.log(ctx);
        controller.earthSurfaceShader.lookupTexture.needsUpdate = true;

    }

    function generateFillStyle ( color ) {

        return 'rgb(' + color + ',' + color + ',' + color +')';

    }

    function update () {

        controller.earthSurfaceShader.update();

        highlightCountry( controller.selectedCountry.colorCode );

    }

    return {

        getPickColor: getPickColor,

        highlightCountry: highlightCountry,

        update: update

    }

}

/**
 * @author syt123450 / https://github.com/syt123450
 */

/**
 * This handlers handle rotation of the globe.
 */

function RotationHandler ( controller ) {

    var rotateX = 0, rotateY = 0;
    var rotateVX = 0, rotateVY = 0;
    var rotateTargetX = undefined;
    var rotateTargetY = undefined;
    var rotateXMax = 90 * Math.PI / 180;

    var dragging = false;

    function update () {

        if ( rotateTargetX !== undefined && rotateTargetY !== undefined ) {

            rotateVX += ( rotateTargetX - rotateX ) * 0.012;
            rotateVY += ( rotateTargetY - rotateY ) * 0.012;

            if ( Math.abs( rotateTargetX - rotateX ) < 0.1 && Math.abs( rotateTargetY - rotateY ) < 0.1 ) {

                rotateTargetX = undefined;
                rotateTargetY = undefined;

            }

        }

        rotateX += rotateVX;
        rotateY += rotateVY;

        rotateVX *= 0.98;
        rotateVY *= 0.98;

        if ( dragging || rotateTargetX !== undefined ) {

            rotateVX *= 0.6;
            rotateVY *= 0.6;

        }

        if ( rotateX < -rotateXMax ) {

            rotateX = -rotateXMax;
            rotateVX *= -0.95;

        }

        if ( rotateX > rotateXMax ) {

            rotateX = rotateXMax;
            rotateVX *= -0.95;

        }

        controller.rotating.rotation.x = rotateX;
        controller.rotating.rotation.y = rotateY;

    }

    function rotateToTargetCountry () {

        var selectedCountry = controller.selectedCountry;

        rotateTargetX = selectedCountry.lat * Math.PI / 180;
        var targetY0 = -( selectedCountry.lon - 9 ) * Math.PI / 180;
        var piCounter = 0;

        while( true ) {

            var targetY0Neg = targetY0 - Math.PI * 2 * piCounter;
            var targetY0Pos = targetY0 + Math.PI * 2 * piCounter;

            if ( Math.abs( targetY0Neg - controller.rotating.rotation.y ) < Math.PI ) {

                rotateTargetY = targetY0Neg;
                break;

            } else if ( Math.abs( targetY0Pos - controller.rotating.rotation.y ) < Math.PI ) {

                rotateTargetY = targetY0Pos;
                break;

            }

            piCounter++;
            rotateTargetY = Utils.wrap(targetY0, -Math.PI, Math.PI);

        }

        rotateVX *= 0.6;
        rotateVY *= 0.6;

    }

    return {

        rotateToTargetCountry: rotateToTargetCountry,

        update: update,

        addRotateVY: function ( VYValue ) {

            rotateVY += VYValue;

        },

        addRotateVX: function ( VXValue ) {

            rotateVX += VXValue;

        },

        setDragging: function( isDragging ) {

            dragging = isDragging;

        },

        isDragging: function () {

            return dragging;

        },

        clearRotateTargetX: function () {

            rotateTargetX = undefined;

        }

    }

}

/**
 * @author syt123450 / https://github.com/syt123450
 */

/**
 * This handlers handle the mouse wheel task.
 */

function WheelHandler ( controller ) {

    var nearPoint = 0;
    var farPoint = 2000;

    function handleMWheel ( delta ) {

        if ( controller.camera.position.z + delta * 100 <= nearPoint || controller.camera.position.z + delta * 100 >= farPoint) {

            // if no zoom in or zoom out wheel page

            // document.body.scrollTop += delta * 5;
            // document.documentElement.scrollTop += delta * 5;

        } else {

            // zoom in or zoom out the camera, its just like magnify or minify the globe
            // constrain camera to 1000 - 2000

            var positionZ = Utils.constrain( controller.camera.position.z + delta * 100, nearPoint, farPoint );
            controller.camera.position.set( 0, 0, positionZ );

        }

    }

    return {

        handleMWheel: handleMWheel

    }

}

/**
 * @author botime / https://github.com/botime
 * @author syt123450 / https://github.com/syt123450
 */

function HaloShader ( controller ) {

    var colorVector = new THREE.Vector3();

    update();

    function update () {

        var color = new THREE.Color( controller.configure.color.halo );

        colorVector.x = color.r;
        colorVector.y = color.g;
        colorVector.z = color.b;
    }

    return {

        uniforms: {

            "haloColor": { type: 'v3', value: colorVector }

        },

        vertexShader: [

            'varying vec3 vNormal;',

            'void main() {',

                'vNormal = normalize( normalMatrix * normal );',
                'gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',

            '}'

        ].join( '\n' ),

        fragmentShader: [

            'varying vec3 vNormal;',
            "uniform vec3 haloColor;",

            'void main() {',

                'float intensity = pow( 0.5 - dot( vNormal, vec3( 0, 0, 1.0 ) ), 16.0 );',
                'gl_FragColor = vec4( haloColor, 1.0 ) * intensity;',

            '}'

        ].join( '\n' ),

        update: update

    }
}

/**
 * @author syt123450 / https://github.com/syt123450
 */

/**
 * This is the image in "/assets/images/map_indexed.png", encoded in based64
 */

var MapIndexBase64 = ( function () {

    return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAEAAAAAgACAYAAACmkva+AAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAAAJcEhZcwAAEnQAABJ0Ad5mH3gAADgsaVRYdFhNTDpjb20uYWRvYmUueG1wAAAAAAA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/Pgo8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjYtYzEzOCA3OS4xNTk4MjQsIDIwMTYvMDkvMTQtMDE6MDk6MDEgICAgICAgICI+CiAgIDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+CiAgICAgIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiCiAgICAgICAgICAgIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIKICAgICAgICAgICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIgogICAgICAgICAgICB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIgogICAgICAgICAgICB4bWxuczpzdEV2dD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlRXZlbnQjIgogICAgICAgICAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyIKICAgICAgICAgICAgeG1sbnM6ZXhpZj0iaHR0cDovL25zLmFkb2JlLmNvbS9leGlmLzEuMC8iPgogICAgICAgICA8eG1wOkNyZWF0b3JUb29sPkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE3IChNYWNpbnRvc2gpPC94bXA6Q3JlYXRvclRvb2w+CiAgICAgICAgIDx4bXA6Q3JlYXRlRGF0ZT4yMDE4LTAxLTI2VDE0OjUzOjUzLTA4OjAwPC94bXA6Q3JlYXRlRGF0ZT4KICAgICAgICAgPHhtcDpNb2RpZnlEYXRlPjIwMTgtMDItMDlUMTY6MjU6NDAtMDg6MDA8L3htcDpNb2RpZnlEYXRlPgogICAgICAgICA8eG1wOk1ldGFkYXRhRGF0ZT4yMDE4LTAyLTA5VDE2OjI1OjQwLTA4OjAwPC94bXA6TWV0YWRhdGFEYXRlPgogICAgICAgICA8ZGM6Zm9ybWF0PmltYWdlL3BuZzwvZGM6Zm9ybWF0PgogICAgICAgICA8cGhvdG9zaG9wOkNvbG9yTW9kZT4zPC9waG90b3Nob3A6Q29sb3JNb2RlPgogICAgICAgICA8eG1wTU06SW5zdGFuY2VJRD54bXAuaWlkOmZlNjkzMDQzLWNhZDEtNDllYS05NDQ3LWJmZTA0NGNhNjYxMDwveG1wTU06SW5zdGFuY2VJRD4KICAgICAgICAgPHhtcE1NOkRvY3VtZW50SUQ+eG1wLmRpZDpmZTY5MzA0My1jYWQxLTQ5ZWEtOTQ0Ny1iZmUwNDRjYTY2MTA8L3htcE1NOkRvY3VtZW50SUQ+CiAgICAgICAgIDx4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ+eG1wLmRpZDpmZTY5MzA0My1jYWQxLTQ5ZWEtOTQ0Ny1iZmUwNDRjYTY2MTA8L3htcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD4KICAgICAgICAgPHhtcE1NOkhpc3Rvcnk+CiAgICAgICAgICAgIDxyZGY6U2VxPgogICAgICAgICAgICAgICA8cmRmOmxpIHJkZjpwYXJzZVR5cGU9IlJlc291cmNlIj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OmFjdGlvbj5jcmVhdGVkPC9zdEV2dDphY3Rpb24+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDppbnN0YW5jZUlEPnhtcC5paWQ6ZmU2OTMwNDMtY2FkMS00OWVhLTk0NDctYmZlMDQ0Y2E2NjEwPC9zdEV2dDppbnN0YW5jZUlEPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6d2hlbj4yMDE4LTAxLTI2VDE0OjUzOjUzLTA4OjAwPC9zdEV2dDp3aGVuPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6c29mdHdhcmVBZ2VudD5BZG9iZSBQaG90b3Nob3AgQ0MgMjAxNyAoTWFjaW50b3NoKTwvc3RFdnQ6c29mdHdhcmVBZ2VudD4KICAgICAgICAgICAgICAgPC9yZGY6bGk+CiAgICAgICAgICAgIDwvcmRmOlNlcT4KICAgICAgICAgPC94bXBNTTpIaXN0b3J5PgogICAgICAgICA8dGlmZjpPcmllbnRhdGlvbj4xPC90aWZmOk9yaWVudGF0aW9uPgogICAgICAgICA8dGlmZjpYUmVzb2x1dGlvbj43MjAwMDAvMTAwMDA8L3RpZmY6WFJlc29sdXRpb24+CiAgICAgICAgIDx0aWZmOllSZXNvbHV0aW9uPjcyMDAwMC8xMDAwMDwvdGlmZjpZUmVzb2x1dGlvbj4KICAgICAgICAgPHRpZmY6UmVzb2x1dGlvblVuaXQ+MjwvdGlmZjpSZXNvbHV0aW9uVW5pdD4KICAgICAgICAgPGV4aWY6Q29sb3JTcGFjZT42NTUzNTwvZXhpZjpDb2xvclNwYWNlPgogICAgICAgICA8ZXhpZjpQaXhlbFhEaW1lbnNpb24+NDA5NjwvZXhpZjpQaXhlbFhEaW1lbnNpb24+CiAgICAgICAgIDxleGlmOlBpeGVsWURpbWVuc2lvbj4yMDQ4PC9leGlmOlBpeGVsWURpbWVuc2lvbj4KICAgICAgPC9yZGY6RGVzY3JpcHRpb24+CiAgIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg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yNxxxx1xqt7Ro0fjNNn+/fvjBIu777774lSfBx54IE4AAMAQrY+XAAAAtXn++edHh/R87WtfixMAmVACAABtCWH87NRtWtkAF6si/P/GN74xTgAAcGngf7wQgH744he/GKf5QuA/fwAAqM/evXtHBwAAAFKmAAAAAGiMIoA0KQEAAIA0zSoDCOH9/FmGIoD6hOB/Fv7P5vEDQHm2/wNdUSbYrwSgn6aVAAj8QztsmG/OZZddFqeVlWPHjsUJuuvw4cNxWoz/jk2TEgAAAABSpgAAAABonCKA9CgBAACAblumCGBSwQDLKRPuVwSQls2bN8cJSJXQBLCMffv2xak5IdhfRbj/U5/6VJzomlACEI7APzAkP/mTPxmnlZWjR4/GCRazc+fOODVn2cA/833iE5+IU7uUAJCqBx54IE4AAMBQKQAAAABakxUB5A/taaME4LnnnosTQBpuvPHGOM2W31wDAG0Q2m/GddddF6c1WVg/H9jPv2/8Y2Us87kwZFdffXWcGALhf6DLlikCEP7vvhdffDFOAMNwww03vPy7lJdeemnl2LFjo3mahx56KE7Qf/7btn47dux4+RShBAAAAIAUrTt/zq2NAAAAadmyZUucaNK1114bp+V84xvfiNNkVYf/3/ve98Zpsve///1xAlhOPvwfXrQGAG3JNv6HMoAwKwWoXr4AoMlw/uc///k40ZaTJ0/GidQpABgOAYm0nTp1Kk6wmLvvvjtO9bv33nvjlJ49e/bE6QLh/24T/If0rK6uxom6/fVf//XK17/+9dEcfrfyjne8YzSPE/5nlqa3/xfZ/F/FfTpz5kycuOOOO+JUn6NHj8Zptv3798cJLnbfffddspE/vK9O418PAAAYnvXxEgAAIDnPP//86NCsr33ta3GqT5Ph/xD8F/4HlhVemJadvEnvA4CmhMB/FvoX/q9X05v5m/56AACkJwT/hf+7KYT+swMwZDfccEOcphcqC//TthD4z595mi4koBo7duyI02x79+4dHcirO+g/ifA/AAAQrDt/zq2NAAAAaduyZUucqNu1114bp8V94xvfiNPF6g7/C/sDdSga8p/2AjYASNGf/MmfjC6VB0x33XXXtRrG//znPx8nmnby5Mk4kTLb/4fD9v/0nTp1Kk6wmLvvvjtO9bv33nvjlJ4NGzbEia4R9oduWV1djRN1E/BnWXUG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"

}() );

/**
 * @author syt123450 / https://github.com/syt123450
 */

/**
 * This is the image in "/assets/images/map_outline.png", encoded in based64
 */

var MapOutlineBase64 = ( function () {

    return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAEAAAAAgACAYAAACmkva+AAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAAAJcEhZcwAAEnQAABJ0Ad5mH3gAADgsaVRYdFhNTDpjb20uYWRvYmUueG1wAAAAAAA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/Pgo8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjYtYzEzOCA3OS4xNTk4MjQsIDIwMTYvMDkvMTQtMDE6MDk6MDEgICAgICAgICI+CiAgIDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+CiAgICAgIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiCiAgICAgICAgICAgIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIKICAgICAgICAgICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIgogICAgICAgICAgICB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIgogICAgICAgICAgICB4bWxuczpzdEV2dD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlRXZlbnQjIgogICAgICAgICAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyIKICAgICAgICAgICAgeG1sbnM6ZXhpZj0iaHR0cDovL25zLmFkb2JlLmNvbS9leGlmLzEuMC8iPgogICAgICAgICA8eG1wOkNyZWF0b3JUb29sPkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE3IChNYWNpbnRvc2gpPC94bXA6Q3JlYXRvclRvb2w+CiAgICAgICAgIDx4bXA6Q3JlYXRlRGF0ZT4yMDE4LTAxLTI2VDE0OjUzOjUzLTA4OjAwPC94bXA6Q3JlYXRlRGF0ZT4KICAgICAgICAgPHhtcDpNb2RpZnlEYXRlPjIwMTgtMDItMDlUMTY6MjU6NDAtMDg6MDA8L3htcDpNb2RpZnlEYXRlPgogICAgICAgICA8eG1wOk1ldGFkYXRhRGF0ZT4yMDE4LTAyLTA5VDE2OjI1OjQwLTA4OjAwPC94bXA6TWV0YWRhdGFEYXRlPgogICAgICAgICA8ZGM6Zm9ybWF0PmltYWdlL3BuZzwvZGM6Zm9ybWF0PgogICAgICAgICA8cGhvdG9zaG9wOkNvbG9yTW9kZT4zPC9waG90b3Nob3A6Q29sb3JNb2RlPgogICAgICAgICA8eG1wTU06SW5zdGFuY2VJRD54bXAuaWlkOmZlNjkzMDQzLWNhZDEtNDllYS05NDQ3LWJmZTA0NGNhNjYxMDwveG1wTU06SW5zdGFuY2VJRD4KICAgICAgICAgPHhtcE1NOkRvY3VtZW50SUQ+eG1wLmRpZDpmZTY5MzA0My1jYWQxLTQ5ZWEtOTQ0Ny1iZmUwNDRjYTY2MTA8L3htcE1NOkRvY3VtZW50SUQ+CiAgICAgICAgIDx4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ+eG1wLmRpZDpmZTY5MzA0My1jYWQxLTQ5ZWEtOTQ0Ny1iZmUwNDRjYTY2MTA8L3htcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD4KICAgICAgICAgPHhtcE1NOkhpc3Rvcnk+CiAgICAgICAgICAgIDxyZGY6U2VxPgogICAgICAgICAgICAgICA8cmRmOmxpIHJkZjpwYXJzZVR5cGU9IlJlc291cmNlIj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OmFjdGlvbj5jcmVhdGVkPC9zdEV2dDphY3Rpb24+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDppbnN0YW5jZUlEPnhtcC5paWQ6ZmU2OTMwNDMtY2FkMS00OWVhLTk0NDctYmZlMDQ0Y2E2NjEwPC9zdEV2dDppbnN0YW5jZUlEPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6d2hlbj4yMDE4LTAxLTI2VDE0OjUzOjUzLTA4OjAwPC9zdEV2dDp3aGVuPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6c29mdHdhcmVBZ2VudD5BZG9iZSBQaG90b3Nob3AgQ0MgMjAxNyAoTWFjaW50b3NoKTwvc3RFdnQ6c29mdHdhcmVBZ2VudD4KICAgICAgICAgICAgICAgPC9yZGY6bGk+CiAgICAgICAgICAgIDwvcmRmOlNlcT4KICAgICAgICAgPC94bXBNTTpIaXN0b3J5PgogICAgICAgICA8dGlmZjpPcmllbnRhdGlvbj4xPC90aWZmOk9yaWVudGF0aW9uPgogICAgICAgICA8dGlmZjpYUmVzb2x1dGlvbj43MjAwMDAvMTAwMDA8L3RpZmY6WFJlc29sdXRpb24+CiAgICAgICAgIDx0aWZmOllSZXNvbHV0aW9uPjcyMDAwMC8xMDAwMDwvdGlmZjpZUmVzb2x1dGlvbj4KICAgICAgICAgPHRpZmY6UmVzb2x1dGlvblVuaXQ+MjwvdGlmZjpSZXNvbHV0aW9uVW5pdD4KICAgICAgICAgPGV4aWY6Q29sb3JTcGFjZT42NTUzNTwvZXhpZjpDb2xvclNwYWNlPgogICAgICAgICA8ZXhpZjpQaXhlbFhEaW1lbnNpb24+NDA5NjwvZXhpZjpQaXhlbFhEaW1lbnNpb24+CiAgICAgICAgIDxleGlmOlBpeGVsWURpbWVuc2lvbj4yMDQ4PC9leGlmOlBpeGVsWURpbWVuc2lvbj4KICAgICAgPC9yZGY6RGVzY3JpcHRpb24+CiAgIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg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yNxxxx1xqt7Ro0fjNNn+/fvjBIu777774lSfBx54IE4AAMAQrY+XAAAAtXn++edHh/R87WtfixMAmVACAABtCWH87NRtWtkAF6si/P/GN74xTgAAcGngf7wQgH744he/GKf5QuA/fwAAqM/evXtHBwAAAFKmAAAAAGiMIoA0KQEAAIA0zSoDCOH9/FmGIoD6hOB/Fv7P5vEDQHm2/wNdUSbYrwSgn6aVAAj8QztsmG/OZZddFqeVlWPHjsUJuuvw4cNxWoz/jk2TEgAAAABSpgAAAABonCKA9CgBAACAblumCGBSwQDLKRPuVwSQls2bN8cJSJXQBLCMffv2xak5IdhfRbj/U5/6VJzomlACEI7APzAkP/mTPxmnlZWjR4/GCRazc+fOODVn2cA/833iE5+IU7uUAJCqBx54IE4AAMBQKQAAAABakxUB5A/taaME4LnnnosTQBpuvPHGOM2W31wDAG0Q2m/GddddF6c1WVg/H9jPv2/8Y2Us87kwZFdffXWcGALhf6DLlikCEP7vvhdffDFOAMNwww03vPy7lJdeemnl2LFjo3mahx56KE7Qf/7btn47dux4+RShBAAAAIAUrTt/zq2NAAAAadmyZUucaNK1114bp+V84xvfiNNkVYf/3/ve98Zpsve///1xAlhOPvwfXrQGAG3JNv6HMoAwKwWoXr4AoMlw/uc///k40ZaTJ0/GidQpABgOAYm0nTp1Kk6wmLvvvjtO9bv33nvjlJ49e/bE6QLh/24T/If0rK6uxom6/fVf//XK17/+9dEcfrfyjne8YzSPE/5nlqa3/xfZ/F/FfTpz5kycuOOOO+JUn6NHj8Zptv3798cJLnbfffddspE/vK9O418PAAAYnvXxEgAAIDnPP//86NCsr33ta3GqT5Ph/xD8F/4HlhVemJadvEnvA4CmhMB/FvoX/q9X05v5m/56AACkJwT/hf+7KYT+swMwZDfccEOcphcqC//TthD4z595mi4koBo7duyI02x79+4dHcirO+g/ifA/AAAQrDt/zq2NAAAAaduyZUucqNu1114bp8V94xvfiNPF6g7/C/sDdSga8p/2AjYASNGf/MmfjC6VB0x33XXXtRrG//znPx8nmnby5Mk4kTLb/4fD9v/0nTp1Kk6wmLvvvjtO9bv33nvjlJ4NGzbEia4R9oduWV1djRN1E/BnWXUG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";

}() );

/**
 * @author syt123450 / https://github.com/syt123450
 */

/**
 * shader material's parameter for earth surface
 */

function EarthSurfaceShader ( controller ) {

    var helperColor = new THREE.Color();

    // cache color object for surface color

    var surfaceColor = new THREE.Vector3();

    //cache color object for selected Color

    var selectedColor = new THREE.Vector3();

    var lookupCanvas, lookupTexture;

    // the uniforms object will be created when the EarthSurfaceShader object is created

    var uniforms = createUniforms();

    // this function create the uniform for shader

    function createUniforms () {

        loadSurfaceColor();

        var uniforms = {};
        //gyh alter MapIndexBase64 to require("../textures/planets/map_outline2.png")
        var mapIndexedTexture = ( new THREE.TextureLoader() ).load( MapIndexBase64 );

        // the mapIndex is used for getting the color when click on the earth

        uniforms.mapIndex = { type: 't', value: mapIndexedTexture };
        uniforms.mapIndex.value.magFilter = THREE.NearestFilter;
        uniforms.mapIndex.value.minFilter = THREE.NearestFilter;

        lookupCanvas = document.createElement( 'canvas' );
        lookupCanvas.width = 256;
        lookupCanvas.height = 1;

        lookupTexture = new THREE.Texture( lookupCanvas );
        lookupTexture.magFilter = THREE.NearestFilter;
        lookupTexture.minFilter = THREE.NearestFilter;
        lookupTexture.needsUpdate = true;

        // the lookup is used for

        uniforms.lookup = { type: 't', value: lookupTexture };

        //gyh alter image MapOutlineBase64 to require("../textures/planets/map_outline1.png")
        var mapOutlineTexture = ( new THREE.TextureLoader() ).load( require("../textures/planets/map_outline1.png") );

        // the outline is what the user see in browser

        uniforms.outline = { type: 't', value: mapOutlineTexture };

        // the outlineLevel is used by webgl to judge whether to show outline

        uniforms.outlineLevel = { type: 'f', value: 1 };

        // the surfaceColor is passed into webgl to render the surface color

        uniforms.surfaceColor = { type: 'v3', value: surfaceColor };

        // the flag is passed into webgl to judge whether to show surface color

        uniforms.flag = { type: 'f', value: 0 };

        // the selectedColor is passed into webgl to render the selected country on the surface

        uniforms.selectedColor = { type: 'v3', value: selectedColor };

        return uniforms;

    }

    // this function will set selectedColor and surfaceColor based on the configure

    function loadSurfaceColor () {

        setShaderColor( controller.configure.color.surface );

        if ( controller.configure.color.selected === null ) {

            setHighlightColor( controller.configure.color.surface );

        } else {

            setHighlightColor( controller.configure.color.selected );

        }

    }

    function setShaderColor( color ) {

        if (color === null) {

            return;

        }

        color = Utils.formatColor( color );

        helperColor.setHex( color );

        surfaceColor.x = helperColor.r;
        surfaceColor.y = helperColor.g;
        surfaceColor.z = helperColor.b;

    }

    function setHighlightColor(color) {

        if (color === null) {

            return;

        }

        color = Utils.formatColor( color );

        helperColor.setHex( color );

        selectedColor.x = helperColor.r;
        selectedColor.y = helperColor.g;
        selectedColor.z = helperColor.b;

    }

    // this function used to update the shader material when user change the surface color at run time

    function update () {

        loadSurfaceColor();

    }

    return {

        //uniforms: uniforms,

        vertexShader: [

            "varying vec2 vUv;",

            "void main() {",
                "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0);",
                "vUv = uv;",
            "}"

        ].join( "\n" ),

        fragmentShader: [

            "uniform sampler2D mapIndex;",
            "uniform sampler2D lookup;",
            "uniform sampler2D outline;",
            "uniform float outlineLevel;",
            "varying vec2 vUv;",

            "uniform vec3 surfaceColor;",
            "uniform float flag;",
            "uniform vec3 selectedColor;",

            "void main() {",
                "vec4 mapColor = texture2D( mapIndex, vUv );",
                "float indexedColor = mapColor.x;",
                "vec2 lookupUV = vec2( indexedColor, 0. );",
                "vec4 lookupColor = texture2D( lookup, lookupUV );",
                "float mask = lookupColor.x + (1.-outlineLevel) * indexedColor;",
                "mask = clamp(mask,0.,1.);",
                "float outlineColor = texture2D( outline, vUv ).x * outlineLevel;",
                "float diffuse = mask + outlineColor;",

                "vec3 earthColor = vec3(0.0, 0.0, 0.0);",
                "earthColor.x = flag * surfaceColor.x * diffuse + (1.0 - flag) * diffuse;",
                "earthColor.y = flag * surfaceColor.y * diffuse + (1.0 - flag) * diffuse;",
                "earthColor.z = flag * surfaceColor.z * diffuse + (1.0 - flag) * diffuse;",

                "if (lookupColor.x > 0.9) {",
                    "earthColor = selectedColor * diffuse;",
                "}",
                "gl_FragColor = vec4( earthColor, 1.  );",

            "}"

        ].join( "\n" ),

        lookupCanvas: lookupCanvas,

        lookupTexture: lookupTexture,

        update: update

    }
}

/**
 * @author syt123450 / https://github.com/syt123450
 */

/**
 * This is the image in "/assets/images/particle.png", encoded in based64
 */

var ParticleBase64 = ( function () {

    return "data:image/png;base64,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";

}() );

/**
 * @author syt123450 / https://github.com/syt123450
 */

/**
 * Shader material's parameter for moving sprite on spline
 */

function MovingSpriteShader () {

    var particleTexture = ( new THREE.TextureLoader() ).load( ParticleBase64 );

    var uniform = {

        amplitude: { type: "f", value: 1.0 },
        color: { type: "c", value: new THREE.Color( 0xffffff ) },
        texture: { type: "t", value: particleTexture }

    };

    return {

        uniforms: uniform,

        vertexShader: [

            "uniform float amplitude;",

            "attribute float size;",
            "attribute vec3 customColor;",

            "varying vec3 vColor;",

            "void main() {",

                "vColor = customColor;",

                "vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );",

                "gl_PointSize = size;",

                "gl_Position = projectionMatrix * mvPosition;",

            "}"

        ].join( "\n" ),

        fragmentShader: [

            "uniform vec3 color;",
            "uniform sampler2D texture;",

            "varying vec3 vColor;",

            "void main() {",

                "gl_FragColor = vec4( color * vColor, 1.0 );",
                "gl_FragColor = gl_FragColor * texture2D( texture, gl_PointCoord );",

            "}"

        ].join( "\n" )

    };
}

/**
 * @author syt123450 / https://github.com/syt123450
 * @author Botime / https://github.com/BoTime
 */

/**
 * This is a singleton object.
 * This object contains all country information in detail.
 */

var CountryData = ( function () {

    var basicCountryData = {

        AD: { colorCode: 186, name: 'ANDORRA', lat: 42.5, lon: 1.6 },
        AE: { colorCode: 22, name: 'UNITED ARAB EMIRATES', lat: 24, lon: 54 },
        AF: { colorCode: 30, name: 'AFGHANISTAN', lat: 33, lon: 65 },
        AG: { colorCode: 190, name: 'ANTIGUA AND BARBUDA', lat: 17.05, lon: -61.8 },
        AI: { colorCode: 215, name: 'ANGUILLA', lat: 18.25, lon: -63.1667 },
        AL: { colorCode: 69, name: 'ALBANIA', lat: 41, lon: 20 },
        AM: { colorCode: 115, name: 'ARMENIA', lat: 40, lon: 45 },
        AO: { colorCode: 47, name: 'ANGOLA', lat: -12.5, lon: 18.5 },
        AQ: { colorCode: 152, name: 'ANTARCTICA', lat: -90, lon: 0 },
        AR: { colorCode: 76, name: 'ARGENTINA', lat: -34, lon: -64 },
        AS: { colorCode: 208, name: 'AMERICAN SAMOA', lat: -14.3333, lon: -170 },
        AT: { colorCode: 35, name: 'AUSTRIA', lat: 47.3333, lon: 13.3333 },
        AU: { colorCode: 51, name: 'AUSTRALIA', lat: -27, lon: 133 },
        AW: { colorCode: 210, name: 'ARUBA', lat: 12.5, lon: -69.9667 },
        AZ: { colorCode: 106, name: 'AZERBAIJAN', lat: 40.5, lon: 47.5 },
        BA: { colorCode: 94, name: 'BOSNIA AND HERZEGOVINA', lat: 44, lon: 18 },
        BB: { colorCode: 191, name: 'BARBADOS', lat: 13.1667, lon: -59.5333 },
        BD: { colorCode: 31, name: 'BANGLADESH', lat: 24, lon: 90 },
        BE: { colorCode: 100, name: 'BELGIUM', lat: 50.8333, lon: 4 },
        BF: { colorCode: 2, name: 'BURKINA FASO', lat: 13, lon: -2 },
        BG: { colorCode: 103, name: 'BULGARIA', lat: 43, lon: 25 },
        BH: { colorCode: 185, name: 'BAHRAIN', lat: 26, lon: 50.55 },
        BI: { colorCode: 104, name: 'BURUNDI', lat: -3.5, lon: 30 },
        BJ: { colorCode: 143, name: 'BENIN', lat: 9.5, lon: 2.25 },
        BL: { colorCode: 203, name: 'SAINT BARTHÉLEMY' },
        BM: { colorCode: 219, name: 'BERMUDA', lat: 32.3333, lon: -64.75 },
        BN: { colorCode: 170, name: 'BRUNEI DARUSSALAM', lat: 4.5, lon: 114.6667 },
        BO: { colorCode: 10, name: 'BOLIVIA, PLURINATIONAL STATE OF', lat: -17, lon: -65 },
        BR: { colorCode: 24, name: 'BRAZIL', lat: -10, lon: -55 },
        BS: { colorCode: 161, name: 'BAHAMAS', lat: 24.25, lon: -76 },
        BT: { colorCode: 156, name: 'BHUTAN', lat: 27.5, lon: 90.5 },
        BW: { colorCode: 16, name: 'BOTSWANA', lat: -22, lon: 24 },
        BY: { colorCode: 5, name: 'BELARUS', lat: 53, lon: 28 },
        BZ: { colorCode: 23, name: 'BELIZE', lat: 17.25, lon: -88.75 },
        CA: { colorCode: 97, name: 'CANADA', lat: 60, lon: -95 },
        CD: { colorCode: 27, name: 'CONGO, THE DEMOCRATIC REPUBLIC OF THE', lat: 0, lon: 25 },
        CF: { colorCode: 132, name: 'CENTRAL AFRICAN REPUBLIC', lat: 7, lon: 21 },
        CG: { colorCode: 110, name: 'CONGO', lat: -1, lon: 15 },
        CH: { colorCode: 13, name: 'SWITZERLAND', lat: 47, lon: 8 },
        CI: { colorCode: 11, name: 'CÔTE D\'IVOIRE', lat: 8, lon: -5 },
        CK: { colorCode: 206, name: 'COOK ISLANDS', lat: -21.2333, lon: -159.7667 },
        CL: { colorCode: 128, name: 'CHILE', lat: -30, lon: -71 },
        CM: { colorCode: 14, name: 'CAMEROON', lat: 6, lon: 12 },
        CN: { colorCode: 96, name: 'CHINA', lat: 35, lon: 105 },
        CO: { colorCode: 45, name: 'COLOMBIA', lat: 4, lon: -72 },
        CR: { colorCode: 78, name: 'COSTA RICA', lat: 10, lon: -84 },
        CU: { colorCode: 42, name: 'CUBA', lat: 21.5, lon: -80 },
        CV: { colorCode: 172, name: 'CAPE VERDE', lat: 16, lon: -24 },
        CY: { colorCode: 167, name: 'CYPRUS', lat: 35, lon: 33 },
        CZ: { colorCode: 67, name: 'CZECH REPUBLIC', lat: 49.75, lon: 15.5 },
        DE: { colorCode: 48, name: 'GERMANY', lat: 51, lon: 9 },
        DJ: { colorCode: 105, name: 'DJIBOUTI', lat: 11.5, lon: 43 },
        DK: { colorCode: 57, name: 'DENMARK', lat: 56, lon: 10 },
        DM: { colorCode: 181, name: 'DOMINICA', lat: 15.4167, lon: -61.3333 },
        DO: { colorCode: 32, name: 'DOMINICAN REPUBLIC', lat: 19, lon: -70.6667 },
        DZ: { colorCode: 12, name: 'ALGERIA', lat: 28, lon: 3 },
        EC: { colorCode: 142, name: 'ECUADOR', lat: -2, lon: -77.5 },
        EE: { colorCode: 113, name: 'ESTONIA', lat: 59, lon: 26 },
        EG: { colorCode: 87, name: 'EGYPT', lat: 27, lon: 30 },
        EH: { colorCode: 66, name: 'WESTERN SAHARA', lat: 24.5, lon: -13 },
        ER: { colorCode: 149, name: 'ERITREA', lat: 15, lon: 39 },
        ES: { colorCode: 118, name: 'SPAIN', lat: 40, lon: -4 },
        ET: { colorCode: 63, name: 'ETHIOPIA', lat: 8, lon: 38 },
        FI: { colorCode: 70, name: 'FINLAND', lat: 64, lon: 26 },
        FJ: { colorCode: 158, name: 'FIJI', lat: -18, lon: 175 },
        FK: { colorCode: 163, name: 'FALKLAND ISLANDS (MALVINAS)', lat: -51.75, lon: -59 },
        FM: { colorCode: 184, name: 'MICRONESIA, FEDERATED STATES OF', lat: 6.9167, lon: 158.25 },
        FO: { colorCode: 178, name: 'FAROE ISLANDS', lat: 62, lon: -7 },
        FR: { colorCode: 3, name: 'FRANCE', lat: 46, lon: 2 },
        GA: { colorCode: 119, name: 'GABON', lat: -1, lon: 11.75 },
        GB: { colorCode: 77, name: 'UNITED KINGDOM', lat: 54, lon: -2 },
        GD: { colorCode: 197, name: 'GRENADA', lat: 12.1167, lon: -61.6667 },
        GE: { colorCode: 89, name: 'GEORGIA', lat: 42, lon: 43.5 },
        GG: { colorCode: 217, name: 'GUERNSEY', lat: 49.5, lon: -2.56 },
        GH: { colorCode: 34, name: 'GHANA', lat: 8, lon: -2 },
        GI: { colorCode: 222, name: 'GIBRALTAR', lat: 36.1833, lon: -5.3667 },
        GL: { colorCode: 55, name: 'GREENLAND', lat: 72, lon: -40 },
        GM: { colorCode: 164, name: 'GAMBIA', lat: 13.4667, lon: -16.5667 },
        GN: { colorCode: 80, name: 'GUINEA', lat: 11, lon: -10 },
		GP: { colorCode: 3, name: 'FRANCE', lat: 46, lon: 2 },
        GQ: { colorCode: 101, name: 'EQUATORIAL GUINEA', lat: 2, lon: 10 },
        GR: { colorCode: 140, name: 'GREECE', lat: 39, lon: 22 },
        GT: { colorCode: 64, name: 'GUATEMALA', lat: 15.5, lon: -90.25 },
        GU: { colorCode: 227, name: 'GUAM', lat: 13.4667, lon: 144.7833 },
        GW: { colorCode: 33, name: 'GUINEA-BISSAU', lat: 12, lon: -15 },
        GY: { colorCode: 99, name: 'GUYANA', lat: 5, lon: -59 },
        HK: { colorCode: 96, name: 'CHINA', lat: 35, lon: 105 },
        HN: { colorCode: 125, name: 'HONDURAS', lat: 15, lon: -86.5 },
        HR: { colorCode: 54, name: 'CROATIA', lat: 45.1667, lon: 15.5 },
        HT: { colorCode: 93, name: 'HAITI', lat: 19, lon: -72.4167 },
        HU: { colorCode: 120, name: 'HUNGARY', lat: 47, lon: 20 },
        ID: { colorCode: 7, name: 'INDONESIA', lat: -5, lon: 120 },
        IE: { colorCode: 81, name: 'IRELAND', lat: 53, lon: -8 },
        IL: { colorCode: 137, name: 'ISRAEL', lat: 31.5, lon: 34.75 },
        IM: { colorCode: 226, name: 'ISLE OF MAN', lat: 54.23, lon: -4.55 },
        IN: { colorCode: 95, name: 'INDIA', lat: 20, lon: 77 },
        IQ: { colorCode: 53, name: 'IRAQ', lat: 33, lon: 44 },
        IR: { colorCode: 61, name: 'IRAN, ISLAMIC REPUBLIC OF', lat: 32, lon: 53 },
        IS: { colorCode: 126, name: 'ICELAND', lat: 65, lon: -18 },
        IT: { colorCode: 28, name: 'ITALY', lat: 42.8333, lon: 12.8333 },
        JE: { colorCode: 214, name: 'JERSEY', lat: 49.21, lon: -2.13 },
        JM: { colorCode: 166, name: 'JAMAICA', lat: 18.25, lon: -77.5 },
        JO: { colorCode: 20, name: 'JORDAN', lat: 31, lon: 36 },
        JP: { colorCode: 40, name: 'JAPAN', lat: 36, lon: 138 },
        KE: { colorCode: 18, name: 'KENYA', lat: 1, lon: 38 },
        KG: { colorCode: 72, name: 'KYRGYZSTAN', lat: 41, lon: 75 },
        KH: { colorCode: 123, name: 'CAMBODIA', lat: 13, lon: 105 },
        KI: { colorCode: 183, name: 'KIRIBATI', lat: 1.4167, lon: 173 },
        KM: { colorCode: 176, name: 'COMOROS', lat: -12.1667, lon: 44.25 },
        KN: { colorCode: 201, name: 'SAINT KITTS AND NEVIS', lat: 17.3333, lon: -62.75 },
        KP: { colorCode: 139, name: 'KOREA, DEMOCRATIC PEOPLE\'S REPUBLIC OF', lat: 40, lon: 127 },
        KR: { colorCode: 124, name: 'KOREA, REPUBLIC OF', lat: 37, lon: 127.5 },
        KW: { colorCode: 159, name: 'KUWAIT', lat: 29.3375, lon: 47.6581 },
        KY: { colorCode: 200, name: 'CAYMAN ISLANDS', lat: 19.5, lon: -80.5 },
        KZ: { colorCode: 151, name: 'KAZAKHSTAN', lat: 48, lon: 68 },
        LA: { colorCode: 138, name: 'LAO PEOPLE\'S DEMOCRATIC REPUBLIC', lat: 18, lon: 105 },
        LB: { colorCode: 147, name: 'LEBANON', lat: 33.8333, lon: 35.8333 },
        LC: { colorCode: 194, name: 'SAINT LUCIA', lat: 13.8833, lon: -61.1333 },
        LI: { colorCode: 211, name: 'LIECHTENSTEIN', lat: 47.1667, lon: 9.5333 },
        LK: { colorCode: 136, name: 'SRI LANKA', lat: 7, lon: 81 },
        LR: { colorCode: 130, name: 'LIBERIA', lat: 6.5, lon: -9.5 },
        LS: { colorCode: 102, name: 'LESOTHO', lat: -29.5, lon: 28.5 },
        LT: { colorCode: 134, name: 'LITHUANIA', lat: 56, lon: 24 },
        LU: { colorCode: 175, name: 'LUXEMBOURG', lat: 49.75, lon: 6.1667 },
        LV: { colorCode: 58, name: 'LATVIA', lat: 57, lon: 25 },
        LY: { colorCode: 4, name: 'LIBYA', lat: 25, lon: 17 },
        MA: { colorCode: 129, name: 'MOROCCO', lat: 32, lon: -5 },
        MC: { colorCode: 224, name: 'MONACO', lat: 43.7333, lon: 7.4 },
        MD: { colorCode: 146, name: 'MOLDOVA, REPUBLIC OF', lat: 47, lon: 29 },
        ME: { colorCode: 112, name: 'MONTENEGRO', lat: 42, lon: 19 },
        MG: { colorCode: 9, name: 'MADAGASCAR', lat: -20, lon: 47 },
        MH: { colorCode: 209, name: 'MARSHALL ISLANDS', lat: 9, lon: 168 },
        MK: { colorCode: 15, name: 'MACEDONIA, THE FORMER YUGOSLAV REPUBLIC OF', lat: 41.8333, lon: 22 },
        ML: { colorCode: 26, name: 'MALI', lat: 17, lon: -4 },
        MM: { colorCode: 62, name: 'MYANMAR', lat: 22, lon: 98 },
        MN: { colorCode: 155, name: 'MONGOLIA', lat: 46, lon: 105 },
        MP: { colorCode: 187, name: 'NORTHERN MARIANA ISLANDS', lat: 15.2, lon: 145.75 },
        MR: { colorCode: 46, name: 'MAURITANIA', lat: 20, lon: -12 },
        MS: { colorCode: 202, name: 'MONTSERRAT', lat: 16.75, lon: -62.2 },
        MT: { colorCode: 198, name: 'MALTA', lat: 35.8333, lon: 14.5833 },
        MU: { colorCode: 177, name: 'MAURITIUS', lat: -20.2833, lon: 57.55 },
        MV: { colorCode: 199, name: 'MALDIVES', lat: 3.25, lon: 73 },
        MW: { colorCode: 121, name: 'MALAWI', lat: -13.5, lon: 34 },
        MX: { colorCode: 21, name: 'MEXICO', lat: 23, lon: -102 },
        MY: { colorCode: 107, name: 'MALAYSIA', lat: 2.5, lon: 112.5 },
        MZ: { colorCode: 39, name: 'MOZAMBIQUE', lat: -18.25, lon: 35 },
        NA: { colorCode: 85, name: 'NAMIBIA', lat: -22, lon: 17 },
        NC: { colorCode: 157, name: 'NEW CALEDONIA', lat: -21.5, lon: 165.5 },
        NE: { colorCode: 56, name: 'NIGER', lat: 16, lon: 8 },
        NG: { colorCode: 82, name: 'NIGERIA', lat: 10, lon: 8 },
        NI: { colorCode: 127, name: 'NICARAGUA', lat: 13, lon: -85 },
        NL: { colorCode: 131, name: 'NETHERLANDS', lat: 52.5, lon: 5.75 },
        NO: { colorCode: 145, name: 'NORWAY', lat: 62, lon: 10 },
        NP: { colorCode: 148, name: 'NEPAL', lat: 28, lon: 84 },
        NR: { colorCode: 221, name: 'NAURU', lat: -0.5333, lon: 166.9167 },
        NU: { colorCode: 204, name: 'NIUE', lat: -19.0333, lon: -169.8667 },
        NZ: { colorCode: 41, name: 'NEW ZEALAND', lat: -41, lon: 174 },
        OM: { colorCode: 74, name: 'OMAN', lat: 21, lon: 57 },
        PA: { colorCode: 75, name: 'PANAMA', lat: 9, lon: -80 },
        PE: { colorCode: 1, name: 'PERU', lat: -10, lon: -76 },
        PF: { colorCode: 173, name: 'FRENCH POLYNESIA', lat: -15, lon: -140 },
        PG: { colorCode: 52, name: 'PAPUA NEW GUINEA', lat: -6, lon: 147 },
        PH: { colorCode: 108, name: 'PHILIPPINES', lat: 13, lon: 122 },
        PK: { colorCode: 6, name: 'PAKISTAN', lat: 30, lon: 70 },
        PL: { colorCode: 84, name: 'POLAND', lat: 52, lon: 20 },
        PM: { colorCode: 205, name: 'SAINT PIERRE AND MIQUELON', lat: 46.8333, lon: -56.3333 },
        PN: { colorCode: 223, name: 'PITCAIRN', lat: -24.7, lon: -127.4 },
        PR: { colorCode: 168, name: 'PUERTO RICO', lat: 18.25, lon: -66.5 },
        PS: { colorCode: 169, name: 'PALESTINIAN TERRITORY, OCCUPIED', lat: 32, lon: 35.25 },
        PT: { colorCode: 44, name: 'PORTUGAL', lat: 39.5, lon: -8 },
        PW: { colorCode: 188, name: 'PALAU', lat: 7.5, lon: 134.5 },
        PY: { colorCode: 79, name: 'PARAGUAY', lat: -23, lon: -58 },
        QA: { colorCode: 165, name: 'QATAR', lat: 25.5, lon: 51.25 },
		RE: { colorCode: 3, name: 'FRANCE', lat: 46, lon: 2 },
        RO: { colorCode: 59, name: 'ROMANIA', lat: 46, lon: 25 },
        RS: { colorCode: 111, name: 'SERBIA', lat: 44, lon: 21 },
        RU: { colorCode: 92, name: 'RUSSIAN FEDERATION', lat: 60, lon: 100 },
        RW: { colorCode: 114, name: 'RWANDA', lat: -2, lon: 30 },
        SA: { colorCode: 90, name: 'SAUDI ARABIA', lat: 25, lon: 45 },
        SB: { colorCode: 73, name: 'SOLOMON ISLANDS', lat: -8, lon: 159 },
        SC: { colorCode: 189, name: 'SEYCHELLES', lat: -4.5833, lon: 55.6667 },
        SD: { colorCode: 49, name: 'SUDAN', lat: 15, lon: 30 },
        SE: { colorCode: 36, name: 'SWEDEN', lat: 62, lon: 15 },
        SG: { colorCode: 228, name: 'SINGAPORE', lat: 1.3667, lon: 103.8 },
        SH: { colorCode: 213, name: 'SAINT HELENA, ASCENSION AND TRISTAN DA CUNHA', lat: -15.9333, lon: -5.7 },
        SI: { colorCode: 144, name: 'SLOVENIA', lat: 46, lon: 15 },
        SK: { colorCode: 133, name: 'SLOVAKIA', lat: 48.6667, lon: 19.5 },
        SL: { colorCode: 25, name: 'SIERRA LEONE', lat: 8.5, lon: -11.5 },
        SM: { colorCode: 218, name: 'SAN MARINO', lat: 43.7667, lon: 12.4167 },
        SN: { colorCode: 116, name: 'SENEGAL', lat: 14, lon: -14 },
        SO: { colorCode: 29, name: 'SOMALIA', lat: 10, lon: 49 },
        SR: { colorCode: 65, name: 'SURINAME', lat: 4, lon: -56 },
        ST: { colorCode: 179, name: 'SAO TOME AND PRINCIPE', lat: 1, lon: 7 },
        SV: { colorCode: 98, name: 'EL SALVADOR', lat: 13.8333, lon: -88.9167 },
        SY: { colorCode: 71, name: 'SYRIAN ARAB REPUBLIC', lat: 35, lon: 38 },
        SZ: { colorCode: 153, name: 'SWAZILAND', lat: -26.5, lon: 31.5 },
        TC: { colorCode: 192, name: 'TURKS AND CAICOS ISLANDS', lat: 21.75, lon: -71.5833 },
        TD: { colorCode: 68, name: 'CHAD', lat: 15, lon: 19 },
        TG: { colorCode: 117, name: 'TOGO', lat: 8, lon: 1.1667 },
        TH: { colorCode: 50, name: 'THAILAND', lat: 15, lon: 100 },
        TJ: { colorCode: 122, name: 'TAJIKISTAN', lat: 39, lon: 71 },
        TL: { colorCode: 160, name: 'TIMOR-LESTE', lat: -8.55, lon: 125.5167 },
        TM: { colorCode: 141, name: 'TURKMENISTAN', lat: 40, lon: 60 },
        TN: { colorCode: 83, name: 'TUNISIA', lat: 34, lon: 9 },
        TO: { colorCode: 182, name: 'TONGA', lat: -20, lon: -175 },
        TR: { colorCode: 37, name: 'TURKEY', lat: 39, lon: 35 },
        TT: { colorCode: 171, name: 'TRINIDAD AND TOBAGO', lat: 11, lon: -61 },
        TV: { colorCode: 220, name: 'TUVALU', lat: -8, lon: 178 },
        TW: { colorCode: 19, name: 'TAIWAN', lat: 23.5, lon: 121 },
        TZ: { colorCode: 88, name: 'TANZANIA, UNITED REPUBLIC OF', lat: -6, lon: 35 },
        UA: { colorCode: 17, name: 'UKRAINE', lat: 49, lon: 32 },
        UG: { colorCode: 38, name: 'UGANDA', lat: 1, lon: 32 },
        US: { colorCode: 150, name: 'UNITED STATES', lat: 38, lon: -97 },
        UY: { colorCode: 109, name: 'URUGUAY', lat: -33, lon: -56 },
        UZ: { colorCode: 154, name: 'UZBEKISTAN', lat: 41, lon: 64 },
        VA: { colorCode: 225, name: 'HOLY SEE (VATICAN CITY STATE)', lat: 41.9, lon: 12.45 },
        VC: { colorCode: 193, name: 'SAINT VINCENT AND THE GRENADINES', lat: 13.25, lon: -61.2 },
        VE: { colorCode: 43, name: 'VENEZUELA, BOLIVARIAN REPUBLIC OF', lat: 8, lon: -66 },
        VG: { colorCode: 212, name: 'VIRGIN ISLANDS, BRITISH', lat: 18.5, lon: -64.5 },
        VI: { colorCode: 196, name: 'VIRGIN ISLANDS, U.S.', lat: 18.3333, lon: -64.8333 },
        VN: { colorCode: 91, name: 'VIET NAM', lat: 16, lon: 106 },
        VU: { colorCode: 162, name: 'VANUATU', lat: -16, lon: 167 },
        WF: { colorCode: 207, name: 'WALLIS AND FUTUNA', lat: -13.3, lon: -176.2 },
        WS: { colorCode: 174, name: 'SAMOA', lat: -13.5833, lon: -172.3333 },
        YE: { colorCode: 8, name: 'YEMEN', lat: 15, lon: 48 },
        YT: { colorCode: 195, name: 'MAYOTTE', lat: -12.8333, lon: 45.1667 },
        ZA: { colorCode: 86, name: 'SOUTH AFRICA', lat: -29, lon: 24 },
        ZM: { colorCode: 60, name: 'ZAMBIA', lat: -15, lon: 30 },
        ZW: { colorCode: 135, name: 'ZIMBABWE', lat: -20, lon: 30 }

    };

    // This function create the center ( Three.js vector3 ) of all country, and add the center to "basicCountryData" object

    function createCountryCenter () {

        var rad = 100;

        for ( var s in basicCountryData ) {

            var country = basicCountryData[ s ];

            var lon = country.lon - 90;
            var lat = country.lat;

            var phi = Math.PI / 2 - lat * Math.PI / 180 - Math.PI * 0.01;
            var theta = 2 * Math.PI - lon * Math.PI / 180 + Math.PI * 0.06;

            var center = new THREE.Vector3();
            center.x = Math.sin( phi ) * Math.cos( theta ) * rad;
            center.y = Math.cos( phi ) * rad;
            center.z = Math.sin( phi ) * Math.sin( theta ) * rad;

            country.center = center;

        }

    }

    // when CountryData is initialized, it will automatically create the center ( Three.js vector3) for all country

    createCountryCenter();

    return basicCountryData;

}() );

var Continent = (function() {

	var continentList = {
		"names": ["OCEANIA", "NORTH AMERICA", "SOUTH AMERICA", "AFRICA", "EUROPE", "ASIA"],
		"OCEANIA": {
			"countries": ["AU", "CK", "FJ", "GU", "NZ", "PG"],
			"lat": -27,
			"lon": 133
		},
		"NORTH AMERICA": {
			"countries": ["BM", "BS", "CA", "CR", "CU", "GD", "GT", "HN", "HT", "JM", "MX", "NI", "PA", "US", "VE"],
			"lat": 39.5,
			"lon": -95
		},
		"SOUTH AMERICA": {
			"countries": ["AR", "BO", "BR", "CL", "CO", "EC", "GY", "PE", "PY", "UY"],
			"lat": -21,
			"lon": -58.5
		},
		"AFRICA": {
			"countries": ["AO", "BI", "BJ", "BW", "CF", "CG", "CM", "CV", "DZ", "EG", "ET", "GA", "GH", "GM", "GN", "GQ", "KE", "LY", "MA", "MG", "ML", "MR", "MU", "MZ", "NA", "NE", "NG", "RW", "SD", "SN", "SO", "TZ", "UG", "ZA", "ZM", "ZW", "TN"],
			"lat": 1,
			"lon": 17
		},
		"EUROPE": {
			"countries": ["AT", "BE", "BG", "CH", "CZ", "DE", "DK", "EE", "ES", "FI", "FR", "GB", "GR", "HR", "HU", "IE", "IS", "IT", "LT", "LV", "MT", "NL", "NO", "PL", "PT", "RO", "RU", "SE", "SK", "SM", "UA", "VA"],
			"lat": 53.5,
			"lon": 28
		},
		"ASIA": {
			"countries": ["AE", "AF", "AL", "AZ", "BD", "BH", "BN", "BT", "CN", "CY", "ID", "IL", "IN", "IQ", "JO", "JP", "KH", "KP", "KR", "KW", "KZ", "LA", "LB", "LU", "MN", "MV", "MY", "NP", "OM", "PH", "PK", "QA", "SA", "SG", "SY", "TH", "TJ", "TM", "UZ", "VN", "YE"],
			"lat": 35,
			"lon": 108.5
		}
	};

	function createContinentCenter () {

		var rad = 100;

		for ( var i = 0; i < continentList.names.length; i++ ) {

			var continentName = continentList.names[i];
			var continentInfo = continentList[continentName];

			var lon = continentInfo.lon - 90;
			var lat = continentInfo.lat;

			var phi = Math.PI / 2 - lat * Math.PI / 180 - Math.PI * 0.01;
			var theta = 2 * Math.PI - lon * Math.PI / 180 + Math.PI * 0.06;

			var center = new THREE.Vector3();
			center.x = Math.sin( phi ) * Math.cos( theta ) * rad;
			center.y = Math.cos( phi ) * rad;
			center.z = Math.sin( phi ) * Math.sin( theta ) * rad;

			continentInfo.center = center;

		}

	}

	createContinentCenter();

	return continentList;

}());

/**
 * @author syt123450 / https://github.com/syt123450
 * @author botime / https://github.com/botime
 */

/**
 * This utils create objects in for the scene
 */

var ObjectUtils = ( function () {

    function createScene ( controller ) {

        var scene = new THREE.Scene();
        if ( controller.configure.color.background !== null ) {

            scene.background = new THREE.Color( controller.configure.color.background );

        }

        return scene;
    }

    //create Three.js camera

    function createCamera ( container ) {

        var camera = new THREE.PerspectiveCamera( 12, container.clientWidth / container.clientHeight, 1, 20000 );
        camera.position.z = 1400;
        camera.position.y = 0;
        camera.lookAt( 0, 0, 0 );

        return camera;

    }

    //create Three.js lights

    function createLights () {

        var lights = [];

        var light1 = new THREE.AmbientLight( 0x505050 );

        var light2 = new THREE.SpotLight( 0xeeeeee, 3 );
        light2.position.x = 730;
        light2.position.y = 520;
        light2.position.z = 626;
        light2.castShadow = true;

        var light3 = new THREE.PointLight( 0x222222, 14.8 );
        light3.position.x = -640;
        light3.position.y = -500;
        light3.position.z = -1000;

        lights.push( light1 );
        lights.push( light2 );
        lights.push( light3 );

        return lights;

    }

    //create Three.js renderer, using webgl renderer to render canvas

    function createRenderer ( container, alpha ) {

        var sceneArea = document.createElement( "canvas" );

        // the scene's height and width only fit the div's actual height and width

        var cs = getComputedStyle( container );

        var paddingX = parseFloat( cs.paddingLeft ) + parseFloat( cs.paddingRight );
        var paddingY = parseFloat( cs.paddingTop ) + parseFloat( cs.paddingBottom );

        var borderX = parseFloat( cs.borderLeftWidth ) + parseFloat( cs.borderRightWidth );
        var borderY = parseFloat( cs.borderTopWidth ) + parseFloat( cs.borderBottomWidth );

        sceneArea.width = container.clientWidth - paddingX - borderX;
        sceneArea.height = container.clientHeight - paddingY - borderY;

        var renderer = new THREE.WebGLRenderer( { canvas: sceneArea, antialias: false, alpha: alpha } );
        renderer.setSize( sceneArea.width, sceneArea.height );
        renderer.autoClear = false;
        renderer.sortObjects = false;
        renderer.generateMipmaps = false;
        
        return renderer;

    }

    //create stats to monitor performance, for development, the detailed introduce about stats: https://github.com/mrdoob/stats.js

    function createStats () {

        var stats = new Stats();
        stats.showPanel( 1 );
        stats.dom.style.position = "absolute";

        return stats;

    }

    // The Sphere object is the earth object (without spineline visual system)

    function createSphere ( controller ) {

        // create EarthSurfaceShader object when initialized

        var earthSurfaceShader = new EarthSurfaceShader( controller );

        // var shaderMaterial = new THREE.ShaderMaterial( {

        //     uniforms: earthSurfaceShader.uniforms,
        //     vertexShader: earthSurfaceShader.vertexShader,
        //     fragmentShader: earthSurfaceShader.fragmentShader

        // } );
        //gyh alter material 0723
        var materialClouds = new THREE.MeshBasicMaterial({
            map: new THREE.TextureLoader().load(
              require("../textures/planets/earth_atmos_2048.jpg")
            ),
            transparent: true
        });

        var sphere = new THREE.Mesh( new THREE.SphereGeometry( 100, 40, 40 ), materialClouds );
        sphere.doubleSided = false;
        sphere.rotation.x = Math.PI;
        sphere.rotation.y = -Math.PI / 2;
        sphere.rotation.z = Math.PI;

        sphere.name = "sphere";

        // hold the pointer for EarthSurfaceShader, the controller will use this pointer to hold the pointer of the EarthSurfaceShader

        sphere.earthSurfaceShader = earthSurfaceShader;

    let andyMesh = sphere;//giojs.getScene().children[3].getObjectByName
       let china = require('./china.json');
       const chinaData = util.decode(china);      
       drawThreeGeo(chinaData, 110, 'sphere', {
         color: 0xff0000,
         transparent: false
       }, andyMesh);

        return sphere;

    }

    function createHalo ( controller ) {

        var radius = 100;
        var geometry = new THREE.SphereBufferGeometry( radius, 32, 32 );

        var haloShader = new HaloShader( controller );
        var shaderMaterial = new THREE.ShaderMaterial( {

            uniforms: haloShader.uniforms,
            vertexShader: haloShader.vertexShader,
            fragmentShader: haloShader.fragmentShader,
            side: THREE.BackSide,
            blending: THREE.AdditiveBlending,
            transparent: true

        } );

        var mesh = new THREE.Mesh( geometry, shaderMaterial );
        mesh.scale.set( 1.2, 1.2, 1.2 );

        mesh.haloShader = haloShader;

        return mesh;

    }

    /**
     * The SplineSystem contains the mesh of spine lines and the moving object on the globe.
     * The mesh will be created each time the clicked country changes.
     */

    function createSplineSystem ( controller ) {

        var geometries = createGeometries( controller );

        var splineOutline = createSplineOutline( geometries.linesGeo );
        var pSystem = createParticleSystem( geometries.particlesGeo, geometries.movingPoints );

        splineOutline.add( pSystem );

        return splineOutline;

    }

    function createGeometries ( controller ) {

        var inputData = controller.globalData;
        controller.relatedCountries = [];
        var selectedCountry = controller.selectedCountry;

        var linesGeo = new THREE.Geometry();
        var lineColors = [];

        var particlesGeo = new THREE.BufferGeometry();

        var movingPoints = [];

        var positions = [];
        var sizes = [];
        var customColors = [];

        for (var i in inputData) {

            var set = inputData[ i ];

            if ( ( controller.configure.control.inOnly && set.i !== CountryColorMap[ selectedCountry.colorCode ] ) ||
                ( controller.configure.control.outOnly && set.e !== CountryColorMap[ selectedCountry.colorCode ] ) ) {

                continue;

            }

            if ( set.i === CountryColorMap[ selectedCountry.colorCode ] ||
                set.e === CountryColorMap[ selectedCountry.colorCode ] ) {

                var lineColor;

                if ( set.e === CountryColorMap[ selectedCountry.colorCode ] ) {

                    if ( Continent.names.indexOf( set.i.toUpperCase() ) !== -1 ) {

                        var continentCountries = Continent[ set.i.toUpperCase() ].countries;

                        for ( var j = 0; j < continentCountries.length; j++ ) {

                            var countryCode = continentCountries[ j ];

                            if ( CountryData[ countryCode ] !== undefined ) {

								controller.relatedCountries.push(CountryData[continentCountries[j]]);

                            }

                        }

                    } else {

						controller.relatedCountries.push( CountryData[ set.i ] );

                    }

					if ( set.outColor === undefined ) {

						lineColor = new THREE.Color( controller.configure.color.out );

					} else {

						lineColor = new THREE.Color( set.outColor );

					}

                } else {

                    controller.relatedCountries.push( CountryData[ set.e ] );

                    if ( set.inColor === undefined ) {

                        lineColor = new THREE.Color( controller.configure.color.in );

                    } else {

                        lineColor = new THREE.Color( set.inColor );

                    }

                }

                var lastColor;

                for ( var s in set.lineGeometry.vertices ) {

                    lineColors.push( lineColor );
                    lastColor = lineColor;

                }

                linesGeo.merge( set.lineGeometry );

                var particleColor = lastColor.clone();
                var points = set.lineGeometry.vertices;
                var particleCount = Math.floor( set.v / 8000 / set.lineGeometry.vertices.length ) + 1;
                particleCount = Utils.constrain( particleCount, 1, 100 );
                var particleSize = set.lineGeometry.size * controller.container.clientHeight / 1000;

                for ( s = 0; s < particleCount; s++ ) {

                    var desiredIndex = s / particleCount * points.length;

                    var rIndex = Utils.constrain( Math.floor( desiredIndex ), 0, points.length - 1 );
                    var point = points[ rIndex ];
                    var particle = point.clone();
                    particle.moveIndex = rIndex;
                    particle.nextIndex = rIndex + 1;

                    if ( particle.nextIndex >= points.length ) {

                        particle.nextIndex = 0;

                    }

                    particle.lerpN = 0;
                    particle.path = points;

                    movingPoints.push( particle );

                    particle.size = particleSize;

                    positions.push( particle.x );
                    positions.push( particle.y );
                    positions.push( particle.z );

                    sizes.push( particleSize );

                    customColors.push( particleColor.r );
                    customColors.push( particleColor.g );
                    customColors.push( particleColor.b );

                }

            }

        }

        linesGeo.colors = lineColors;

        particlesGeo.addAttribute( "position", new THREE.Float32BufferAttribute( positions, 3 ) );
        particlesGeo.addAttribute( "size", new THREE.Float32BufferAttribute( sizes, 1 ) );
        particlesGeo.addAttribute( "customColor", new THREE.Float32BufferAttribute( customColors, 3 ) );

        particlesGeo.attributes.position.needsUpdate = true;

        return {

            linesGeo: linesGeo,
            particlesGeo: particlesGeo,
            movingPoints: movingPoints

        }

    }

    function createSplineOutline ( linesGeo ) {

        var splineOutline = new THREE.Line( linesGeo, new THREE.LineBasicMaterial( {

            color: 0xffffff,
            opacity: 1.0,
            blending: THREE.AdditiveBlending,
            transparent: true,
            depthWrite: false,
            vertexColors: true,
            linewidth: 1

        } ) );

        splineOutline.renderDepth = false;

        return splineOutline;

    }

    function createParticleSystem ( particlesGeo, movingPoints ) {

        var movingSpriteShader = new MovingSpriteShader();

        var shaderMaterial = new THREE.ShaderMaterial( {

            uniforms: movingSpriteShader.uniforms,
            vertexShader: movingSpriteShader.vertexShader,
            fragmentShader: movingSpriteShader.fragmentShader,

            blending: THREE.AdditiveBlending,
            depthTest: true,
            depthWrite: false,
            transparent: true

        } );

        var pSystem = new THREE.Points( particlesGeo, shaderMaterial );

        pSystem.dynamic = true;

        pSystem.movingPoints = movingPoints;


        pSystem.update = function () {

            for ( var i in this.movingPoints ) {

                var particle = this.movingPoints[ i ];

                var path = particle.path;

                particle.lerpN += 0.05;

                if (particle.lerpN > 1) {

                    particle.lerpN = 0;
                    particle.moveIndex = particle.nextIndex;
                    particle.nextIndex++;

                    if (particle.nextIndex >= path.length) {

                        particle.moveIndex = 0;
                        particle.nextIndex = 1;

                    }

                }

                var currentPoint = path[ particle.moveIndex ];
                var nextPoint = path[ particle.nextIndex ];

                particle.copy( currentPoint );
                if ( nextPoint !== undefined && particle !== undefined ) {

                    particle.lerp( nextPoint, particle.lerpN );

                }

                this.geometry.attributes.position.array[ 3 * i ] = particle.x;
                this.geometry.attributes.position.array[ 3 * i + 1 ] = particle.y;
                this.geometry.attributes.position.array[ 3 * i + 2 ] = particle.z;

            }

            this.geometry.attributes.position.needsUpdate = true;

        };

        return pSystem;
    }

    return {

        createScene: createScene,

        createCamera: createCamera,

        createLights: createLights,

        createRenderer: createRenderer,

        createStats: createStats,

        createSphere: createSphere,

        createHalo: createHalo,

        createSplineSystem: createSplineSystem

    }

}() );

/**
 * @author syt123450 / https://github.com/syt123450
 */

/**
 * This handlers handle the update of VisSystem ( The system will be updated when clicked country changed ).
 */

function VisSystemHandler ( controller ) {

    function update () {
return;
        // first remove the old object from rotating ( contains splines and moving sprites )

        controller.rotating.remove( controller.visualizationMesh );

        // create a new visualization mesh

        controller.visualizationMesh = new THREE.Object3D();
        var lines = ObjectUtils.createSplineSystem( controller );
        controller.visualizationMesh.add( lines );

        // add the new visualization mesh to rotating

        controller.rotating.add( controller.visualizationMesh );

    }

    return {

        update: update

    }

}

/**
 * @author syt123450 / https://github.com/syt123450
 */

/**
 * This handlers handle the switch of the clicked country.
 */

function SwitchCountryHandler ( controller ) {

    var pickedCallBack = null;

    function execute( pickColorIndex ) {

        executeSwitch( pickColorIndex );
        executeCallback();

    }

    function executeSwitch ( pickColorIndex ) {

        // first change the selectedCountry

        controller.selectedCountry = CountryData[ CountryColorMap[ pickColorIndex ] ];

        // then create a new visSystem

        //controller.visSystemHandler.update();

        // change the highlight country on the earth surface

        //controller.surfaceHandler.highlightCountry( pickColorIndex );

        // at last rotate the earth

        controller.rotationHandler.rotateToTargetCountry();

    }

    function executeCallback () {

        if ( pickedCallBack !== null ) {

            // protected clone, return new object for user

            var selectedCountry = Utils.transformCountryData( controller.selectedCountry );

            var relatedCountries = [];

            for ( var i in controller.relatedCountries ) {

                relatedCountries.push(
                    Utils.transformCountryData( controller.relatedCountries[ i ] )
                );

            }

            pickedCallBack( selectedCountry, relatedCountries );

        }

    }

    function switchFromAPI ( ISOAbbr, direction ) {

        // using the snapshot, so the function just change the controller.configure for a short time

        var snapshot = {};

        if ( direction === "in" || direction === "out" ) {

            snapshot.inOnly = controller.configure.control.inOnly;
            snapshot.outOnly = controller.configure.control.outOnly;

            if ( direction === "in" ) {

                controller.configure.control.inOnly = true;
                controller.configure.control.outOnly = false;

            } else {

                controller.configure.control.inOnly = false;
                controller.configure.control.outOnly = true;

            }

        }

        if ( CountryData[ ISOAbbr ] !== undefined ) {

            executeSwitch( CountryData[ ISOAbbr ].colorCode );

        }

        // restore the controller.configure

        if ( direction === "in" || direction === "out" ) {

            controller.configure.control.inOnly = snapshot.inOnly;
            controller.configure.control.outOnly = snapshot.outOnly;

        }

    }

    return {

        executeSwitch: execute,

        switchFromAPI: switchFromAPI,

        setCountryPickCallBack: function ( callBack ) {

            pickedCallBack = callBack;

        }

    }

}

/**
 * @author syt123450 / https://github.com/syt123450
 */

/**
 * This handlers handle resize of the window event.
 */

function ResizeHandler ( controller ) {

    function resizeScene () {

        controller.camera.aspect = controller.container.clientWidth / controller.container.clientHeight;
        controller.camera.updateProjectionMatrix();
        controller.renderer.setSize( controller.container.clientWidth, controller.container.clientHeight );
        controller.visSystemHandler.update();

    }

    return {

        resizeScene: resizeScene

    }

}

/**
 * @author syt123450 / https://github.com/syt123450
 */

/**
 * This Manager manage all mouse event for the scene.
 * This Manager will be created when InitHandler's init() function is called.
 */

function SceneEventManager () {

    var mouseX = 0, mouseY = 0, pmouseX = 0, pmouseY = 0;
    var pressX = 0, pressY = 0;

    var controller;

    // the mouse and raycaster is used to judge whether the mouse is clicked on the globe

    var mouse = new THREE.Vector2();
    var raycaster = new THREE.Raycaster();

    function onDocumentMouseMove ( event ) {

        pmouseX = mouseX;
        pmouseY = mouseY;

        mouseX = event.clientX - controller.container.clientWidth * 0.5 - Utils.getElementViewLeft( controller.container );
        mouseY = event.clientY - controller.container.clientHeight * 0.5 - Utils.getElementViewTop( controller.container );

        // if it is in a dragging state, let the RotationHandler to handlers the rotation of the globe

        if ( controller.rotationHandler.isDragging() ) {

            controller.rotationHandler.addRotateVY( ( mouseX - pmouseX ) / 2 * Math.PI / 180 * 0.3 );
            controller.rotationHandler.addRotateVX( ( mouseY - pmouseY ) / 2 * Math.PI / 180 * 0.3 );

        }

    }

    function onDocumentMouseDown ( event ) {

        if ( event.target.className.indexOf( 'noMapDrag' ) !== -1 ) {

            return;

        }

        // set the state to the dragging state

        controller.rotationHandler.setDragging( true );
        pressX = mouseX;
        pressY = mouseY;
        controller.rotationHandler.clearRotateTargetX();

    }

    function onDocumentMouseUp ( event ) {

        // When mouse up, the notify the RotatingHandler to set drag false

        controller.rotationHandler.setDragging( false );

    }

    function onMouseWheel ( event ) {

        var delta = 0;

        // calculate the mouse wheel delta in IE or Opera

        if ( event.wheelDelta ) {

            delta = event.wheelDelta / 120;

        }

        //	calculate the mouse wheel delta in firefox

        else if ( event.detail ) {

            delta = -event.detail / 3;

        }

        if ( delta ) {

            // use the WheelHandler to handle actual mouse wheel event, if we would like to do something

            controller.wheelHandler.handleMWheel(delta);

        }

        event.returnValue = false;

    }

    function onResize ( event ) {

        // use the ResizeHandler to handle the actual window resize event, if we would like to do something

        controller.resizeHandler.resizeScene();

    }

    function onClick ( event ) {

        //	if the click is drag, do nothing

        if ( Math.abs( pressX - mouseX ) > 3 || Math.abs( pressY - mouseY ) > 3 ) {

            return;

        }

        // let the mouse and raycaster to judge whether the click is on the earth, if not do noting

        mouse.x = ( ( event.clientX - Utils.getElementViewLeft( controller.container ) ) / controller.container.clientWidth ) * 2 - 1;
        mouse.y = -( ( event.clientY - Utils.getElementViewTop( controller.container ) ) / controller.container.clientHeight ) * 2 + 1;

        raycaster.setFromCamera( mouse, controller.camera );

        var intersects = raycaster.intersectObjects( controller.scene.children, true );

        // intersects.length === 0 means that the mouse click is not on the globe

        if ( intersects.length === 0 ) {

            return;

        }

        // to get the color of clicked area on the globe's surface

        var pickColorIndex = controller.surfaceHandler.getPickColor( mouseX, mouseY );

        // for debug

         //console.log( pickColorIndex );

        /**
         * on a specific condition will let the SwitchCountryHandler to execute switch
         * condition:
         * 1. the picked color is actually a color to represent a country
         * 2. the picked color is not 0 (0 represents ocean)
         * 3. if the user want only the mentioned countries can be clicked, it will judge whether the picked country is mentioned
         */

        if ( CountryColorMap[ pickColorIndex ] !== undefined &&
             pickColorIndex !== 0 &&
             ( ( controller.configure.control.disableUnmentioned &&
                 controller.mentionedCountryCodes.indexOf( pickColorIndex ) !== -1 ) ||
                 !controller.configure.control.disableUnmentioned ) ) {

            controller.switchCountryHandler.executeSwitch( pickColorIndex );

        }

    }

    function onTouchStart ( event ) {

		if ( event.target.className.indexOf( 'noMapDrag' ) !== -1 ) {

			return;

		}

		// set the state to the dragging state

		controller.rotationHandler.setDragging( true );
		pressX = mouseX;
		pressY = mouseY;
		controller.rotationHandler.clearRotateTargetX();

    }

    function onTouchEnd ( event ) {

		// When touch up, the notify the RotatingHandler to set drag false

		controller.rotationHandler.setDragging( false );

    }

    function onTouchMove ( event ) {

		pmouseX = mouseX;
		pmouseY = mouseY;

		// get clientX and clientY from "event.touches[0]", different with onmousemove event

		mouseX = event.touches[0].clientX - controller.container.clientWidth * 0.5 - Utils.getElementViewLeft( controller.container );
		mouseY = event.touches[0].clientY - controller.container.clientHeight * 0.5 - Utils.getElementViewTop( controller.container );

		// if it is in a dragging state, let the RotationHandler to handlers the rotation of the globe

		if ( controller.rotationHandler.isDragging() ) {

			controller.rotationHandler.addRotateVY( ( mouseX - pmouseX ) / 2 * Math.PI / 180 * 0.3 );
			controller.rotationHandler.addRotateVX( ( mouseY - pmouseY ) / 2 * Math.PI / 180 * 0.3 );

		}

    }

    /**
     * bind all event handlers to the dom of the scene, the resize event will be bind to window.
     * This function will be called when InitHandler's init() function be called
     */

    function bindEvent ( controllerPara ) {

        controller = controllerPara;

        controller.renderer.domElement.addEventListener( 'mousemove', onDocumentMouseMove, true );
        controller.renderer.domElement.addEventListener( 'mousedown', onDocumentMouseDown, true );
        controller.renderer.domElement.addEventListener( 'mouseup', onDocumentMouseUp, false );
        controller.renderer.domElement.addEventListener( 'click', onClick, true );
        controller.renderer.domElement.addEventListener( 'mousewheel', onMouseWheel, false );
        controller.renderer.domElement.addEventListener( 'DOMMouseScroll', onMouseWheel, false );

		controller.renderer.domElement.ontouchstart = onTouchStart;
		controller.renderer.domElement.ontouchend = onTouchEnd;
		controller.renderer.domElement.ontouchmove = onTouchMove;

        window.addEventListener( 'resize', onResize, false );

    }

    return {

        bindEvent: bindEvent

    }

}

/**
 * @author mokuteno / https://github.com/manymeeting
 */

function AbstractDataProcessor () {

	this.successor = null;

}

AbstractDataProcessor.prototype.setSuccessor = function ( dp ) {

	this.successor = dp;

};

AbstractDataProcessor.prototype.process = function ( controller ) {

	if ( this.isMatched( controller ) ) {

		this.processDetail( controller );

	}

	if ( this.successor !== null ) {

		this.successor.process( controller );

	}

};

AbstractDataProcessor.prototype.processDetail = function ( controller ) {
};

AbstractDataProcessor.prototype.isMatched = function ( controller ) {

	return true;

};

/**
 * @author syt123450 / https://github.com/syt123450
 */

/**
 * Judge input data is an single data array or data group
 */

function DataTypeProcessor () {}

DataTypeProcessor.prototype = new AbstractDataProcessor();

DataTypeProcessor.prototype.constructor = DataTypeProcessor;

DataTypeProcessor.prototype.processDetail = function ( controller ) {

	var inputData = controller.inputData;
	controller.dataGroup = !Utils.isArray( inputData );

};

/**
 * @author mokuteno / https://github.com/manymeeting
 * @author syt123450 / https://github.com/syt123450
 */

/**
 * This data processor set a new fake data from user's input value, this fake data used for later geometry creation
 */

function TransformProcessor () {}

TransformProcessor.prototype = new AbstractDataProcessor();

TransformProcessor.prototype.constructor = TransformProcessor;

TransformProcessor.prototype.processDetail = function ( controller ) {

    if ( controller.dataGroup ) {

        controller.dataGroupHandler.createFakeData();

    } else {

		controller.singleDataHandler.createFakeData();

    }

};

/**
 * @author mokuteno / https://github.com/manymeeting
 * @author syt123450 / https://github.com/syt123450
 */

/**
 * This default data preprocessor is used to create mentionedCountries for controller.
 * The process() function will be called when InitHandler's init() function is called.
 */

function DefaultDataPreprocessor () {}

DefaultDataPreprocessor.prototype = new AbstractDataProcessor();

DefaultDataPreprocessor.prototype.constructor = DefaultDataPreprocessor;

DefaultDataPreprocessor.prototype.processDetail = function ( controller ) {

    if ( controller.dataGroup ) {

        controller.dataGroupHandler.createMentionedCountries();

    } else {

		controller.singleDataHandler.createMentionedCountries();

    }

};

/**
 * @author syt123450 / https://github.com/syt123450
 */

/**
 * This object build the basic geometry to be used by creation spline geometry and pSystem geometry.
 * The build function will build for all input data
 * The buildDataVizGeometries will be executed when InitHandler's init() function is called
 */

function GeometryDataProcessor () {}

GeometryDataProcessor.prototype = new AbstractDataProcessor();

GeometryDataProcessor.prototype.constructor = GeometryDataProcessor;

GeometryDataProcessor.prototype.processDetail = function ( controller ) {

    if ( controller.dataGroup ) {

        controller.dataGroupHandler.createGeometry();

    } else {

        controller.singleDataHandler.createGeometry();

    }

};

/**
 * @author mokuteno / https://github.com/manymeeting
 */

/**
 * This data processor flattens input data so that even a small number can be properly displayed on the screen.
 */

function FlattenDataProcessor () {}

FlattenDataProcessor.prototype = new AbstractDataProcessor();

FlattenDataProcessor.prototype.constructor = FlattenDataProcessor;

FlattenDataProcessor.prototype.processDetail = function ( controller ) {

    if ( controller.dataGroup ) {

        controller.dataGroupHandler.flattenData();

    } else {

        controller.singleDataHandler.flattenData();

    }
    
};

/**
 * @author syt123450 / https://github.com/syt123450
 */

/**
 * This dumper preprocessor is used to dump processed data into globe.
 */

function DumperProcessor () {}

DumperProcessor.prototype = new AbstractDataProcessor();

DumperProcessor.prototype.constructor = DumperProcessor;

DumperProcessor.prototype.processDetail = function ( controller ) {

	if ( controller.dataGroup ) {

		controller.dataGroupHandler.dumpData();

	} else {

		controller.singleDataHandler.dumpData();

	}

};

/**
 * @author syt123450 / https://github.com/syt123450
 */

var ProcessorManager = ( function () {

    function getProcessorChain () {

        // register data processors here

        var dataTypeProcessor = new DataTypeProcessor();
        var transformDataProcessor = new TransformProcessor();
        var defaultDataPreprocessor = new DefaultDataPreprocessor();
        var dumpProcessor = new DumperProcessor();

        // a processor used to create basic geometry for splines and moving sprites

        var geometryDataProcessor = new GeometryDataProcessor();

        // a processor used to flatten country data

        var flattenDataProcessor = new FlattenDataProcessor();

        // set order of processors

		dataTypeProcessor.setSuccessor(defaultDataPreprocessor);
        defaultDataPreprocessor.setSuccessor( transformDataProcessor );
        transformDataProcessor.setSuccessor( flattenDataProcessor );
        flattenDataProcessor.setSuccessor( geometryDataProcessor );
        geometryDataProcessor.setSuccessor( dumpProcessor );

        return dataTypeProcessor;
    }

    return {

        getProcessorChain: getProcessorChain

    }

}() );

/**
 * @author syt123450 / https://github.com/syt123450
 */

/**
 * This handlers handle initialization task for controller.
 */

function InitHandler ( controller ) {

    function init () {

        initScene();
        animate();

    }

    // this function is used to initialize the data, object and status of the controller

    function initScene () {

        // init all scene objects

        initObjects();

        // init user's input data

        initData();
        
        // bind events to the dom

        ( new SceneEventManager() ).bindEvent( controller );

        // now the creation is finished, append the 3D object to the dom

        controller.container.appendChild( controller.renderer.domElement );

        // init object and action related to selected country

        initSelected();

        // set finishing initialization sign

        controller.initialized = true;

    }

    // the animate function will be execute periodically

    function animate () {

        if ( controller.configure.control.stats ) {

            controller.stats.update();

        }

        controller.rotationHandler.update();

        //controller.renderer.clear();
        controller.renderer.render( controller.scene, controller.camera );

        // update the moving sprite on the spline

        controller.rotating.traverse(

            function ( mesh ) {

                if ( mesh.update !== undefined ) {

                    mesh.update();

                }

            }

        );

        requestAnimationFrame( animate );

    }

    // create objects and add them to the scene

    function initObjects () {

        // create all the objects for the scene

        controller.renderer = ObjectUtils.createRenderer( controller.container, controller.configure.control.transparentBackground );
        controller.camera = ObjectUtils.createCamera( controller.container );
        controller.lights = ObjectUtils.createLights();

        controller.sphere = ObjectUtils.createSphere( controller );
        //controller.halo = ObjectUtils.createHalo( controller );
        //controller.haloShader = controller.halo.haloShader;
        controller.earthSurfaceShader = controller.sphere.earthSurfaceShader;

        controller.scene = ObjectUtils.createScene( controller );
        controller.rotating = new THREE.Object3D();

        // the stats object will only be created when "isStatsEnabled" in the configure is set to be true

        if ( controller.configure.control.stats ) {

            controller.stats = ObjectUtils.createStats( controller.container );
            controller.container.appendChild( controller.stats.dom );

        }

        // add objects to the scene

        for ( var i in controller.lights ) {

            controller.scene.add( controller.lights[ i ] );

        }

        controller.scene.add( controller.rotating );
        controller.rotating.add( controller.sphere );
        //gyh alter 3
    //     let material=new THREE.MeshBasicMaterial({
    //         //color:new THREE.Color( "rgb(94, 153, 195)"),
    //          map: new THREE.TextureLoader().load(
    //            require("../textures/planets/earth_atmos_2048.jpg")
    //          )
    //       })
    //     let geometry = new THREE.SphereGeometry(100, 42, 42)
    //   let earthMesh = new THREE.Mesh(geometry, material);
    //   earthMesh.name='andyMesh';
    //   earthMesh.rotation.y = Math.PI / 2;
    //   earthMesh.rotation.x = Math.PI / 2;
    //   controller.rotating.add(earthMesh);
      

        controller.scene.add( controller.camera );

        // halo must be add after adding the rotating object

        if ( controller.configure.control.halo === true ) {

            controller.scene.add( controller.halo );

        }

    }

    // pre-process the data

    function initData () {

        // set the first data processor on the "chain"

        controller.dataProcessor = ProcessorManager.getProcessorChain();

        // pre-processor the user's input data

        controller.dataProcessor.process(controller);
    }

    // init object and action related to selected country

    function initSelected () {

        // defined the initial country

        controller.selectedCountry = CountryData[ controller.configure.control.initCountry ];

        // create the visSystem based on the previous creation and settings

        controller.visSystemHandler.update();

        // rotate to the init country and highlight the init country

        controller.rotationHandler.rotateToTargetCountry();
        controller.surfaceHandler.highlightCountry( controller.selectedCountry[ "colorCode" ] );
    }

    return {

        init: init

    }

}

/**
 * @author syt123450 / https://github.com/syt123450
 */

/**
 * This is a Configure object, the controller will create a "configure object" and hold the object.
 * When user using the API to do some configuration, they are actually setting the configure object.
 * When IO Globe is running, other component in controller will read this configure object through controller
 */

function Configure () {

    this.control =  {

        // use to control whether show stats panel

        stats: false,

        // used to control whether to let unrelated countries ( unmentioned countries in input data ) unclickable

        disableUnmentioned: false,

        // use to control whether to lighten mentioned countries ( mentioned in input data )

        lightenMentioned: false,

        // control whether only show "in" lines for clicked country

        inOnly: false,

        // control whether only show "out" lines for clicked country

        outOnly: false,

        // setting for the initial country when globe is initialized

        initCountry: "CN",

        // control whether show halo

        halo: true,
        
        // Control whether to have a transparent background.
        
        transparentBackground: false

    };

    this.color = {

        // used to set the surface color

        surface: 0xffffff,

        // used to set the color of selected country

        selected: null,

        // use to set the "in" spline line color

        in: 0x154492,

        // use to set the "out" spline line color

        out: 0xdd380c,

        // use to set halo color

        halo: 0xffffff,

        // use to set the background color of the scene

        background: null

    };

    this.brightness = {

        // use to set the ocean brightness ( range is 0 - 1 )

        ocean: 0.5,

        // use to set the mentioned countries brightness ( range is 0 - 1 ), only the attribute isLightenMentioned == true, this attribute will take effect

        mentioned: 0.5,

        // use to set brightness of countries related to selected country

        related: 0.5

    };


    return this;

}

/**
 * @author syt123450 / https://github.com/syt123450
 */

/**
 * This handlers handle all configure related task for controller.
 */

function ConfigureHandler ( controller ) {

    function configureJSON ( configure ) {

        // the configure process in nature is set the controller.configure with a given JSON

        var attribute;

        if ( configure instanceof Object ) {

            if ( configure.control !== undefined ) {

                for ( attribute in configure.control ) {

                    controller.configure.control[ attribute ] = configure.control[ attribute ];

                }

            }

            if ( configure.color !== undefined ) {

                for ( attribute in configure.color ) {

                    controller.configure.color[ attribute ] = configure.color[ attribute ];

                }

            }

            if ( configure.brightness !== undefined ) {

                for ( attribute in configure.brightness ) {

                    controller.configure.brightness[ attribute ] = configure.brightness[ attribute ];

                }

            }

            if (configure.resource !== undefined ) {

                for ( attribute in configure.resource ) {

                    controller.configure.resource[ attribute ] = configure.resource[ attribute ];

                }

            }

        }

    }

    function configureStyle ( styleName ) {

        // get style from StyleFactory with a given style name

        var style = StyleFactory.getStyle( styleName );

        configureJSON( style );

    }

    function configureConstructor () {

        configureJSON( controller.constructorConfigure );

    }

    return {

        configureJSON: configureJSON,

        configureStyle: configureStyle,

        configureConstructor: configureConstructor

    }

}

/**
 * @author syt123450 / https://github.com/syt123450
 */

/**
 * This is a JSON loader which can load JSON data into the controller
 */

function JSONLoader () {

    function load ( controller, data ) {

        if ( data === undefined || data === null ) {

            data = [];

        }

        controller.inputData = JSON.parse( JSON.stringify( data ) );

    }

    return {

        load: load

    }

}

/**
 * @author syt123450 / https://github.com/syt123450
 */

/**
 * This is the asynchronous loader, which can be used to load data asynchronous from a given url
 */

function AsyncLoader () {

    this.callback = null;

    var asyncLoader = this;

    function load( controller, url, callback ) {

        asyncLoader.callback = callback;

        var request = new XMLHttpRequest();
        request.open( 'GET', url, true );

        request.onreadystatechange = function () {

            if ( request.readyState === 4 && request.status === 200 ) {

                var data = JSON.parse( request.responseText );

                controller.inputData = JSON.parse( JSON.stringify( data ) );

                asyncLoader.callback( data );

            }

        };

        request.send( null );

    }

    return {

        load: load

    }

}

/**
 * @author syt123450 / https://github.com/syt123450
 */

/**
 * This is a live loader, which can be used to load data from a url and refresh the data in the controller
 */

// still in develop

function LiveLoader () {

    this.callback = null;
    this.milliseconds = 5000;

    this.url = null;

    this.intervalHandle = null;
    this.controller = null;

    this.controller = null;

    this.asyncLoader = new AsyncLoader();

    var liveLoader = this;

    function load ( controller, url, callback, milliseconds ) {
debugger;
        liveLoader.controller = controller;
        liveLoader.url = url;
        liveLoader.callback = callback;
        liveLoader.milliseconds = milliseconds;

        liveLoader.intervalHandle = setInterval( function () {

            loopCall();

        }, liveLoader.milliseconds );

    }

    function loopCall () {

        liveLoader.asyncLoader.load( liveLoader.controller, liveLoader.url, updateSystem );

        if ( liveLoader.callback !== null ) {

            liveLoader.callback();

        }

    }

    function updateSystem () {

        if ( liveLoader.controller.initialized === true ) {

            liveLoader.controller.dataProcessor.process();
            liveLoader.controller.visSystemHandler.update();
            liveLoader.controller.surfaceHandler.update();

        }

    }

    function stop () {

        window.clearInterval( liveLoader.intervalHandle );

    }

    return {

        load: load,

        stop: stop

    }

}

/**
 * @author syt123450 / https://github.com/syt123450
 */

/**
 * This handlers handle all data load related task for controller.
 */

function DataHandler ( controller ) {

    // the dataHandler will initialize all loader's instance

    var jsonLoader = new JSONLoader();
    var liveLoader = new LiveLoader();
    var asyncLoader = new AsyncLoader();

    function loadJSON ( data ) {

        // jsonLoader is the proxy of loadJSON task

        jsonLoader.load( controller, data );

    }

    function loadAsync ( url, callback ) {

        // asyncLoader is the proxy of loadAsync task

        asyncLoader.load( controller, url, callback );

    }

    function liveLoad( url, callback, milliseconds ) {

        // liveLoader is the proxy of liveLoad task

        liveLoader.load( controller, url, callback, milliseconds );

    }

    // as liveLoader will load data periodically, this API is used to stop the liveLoader

    function stopLiveLoader () {

        liveLoader.stop();

    }

    return {

        loadJSON: loadJSON,

        loadAsync: loadAsync,

        liveLoad: liveLoad,

        stopLiveLoader: stopLiveLoader

    }

}

/**
 * @author syt123450 / https://github.com/syt123450
 */

function HaloHandler ( controller ) {

    function create () {

        controller.halo = ObjectUtils.createHalo( controller );
        controller.haloShader = controller.halo.haloShader;
        controller.scene.add( controller.halo );

    }

    function remove () {

        controller.scene.remove( controller.halo );
        controller.halo =  null;

    }

    function update () {

        controller.haloShader.update();

    }

    return {

        create: create,

        remove: remove,

        update: update

    }

}

function DataGroupHandler ( controller ) {

	var mentionedCache = {};

	function createMentionedCountries () {

		var inputData = controller.inputData;
		var dataSetKeys = inputData.dataSetKeys;
		var initDataSet = inputData.initDataSet;

		for (var i = 0; i < dataSetKeys.length; i++) {

			var key = dataSetKeys[ i ];
			mentionedCache[ key ] = [];
			var data = inputData[ key ];

			for ( var j in data ) {

				var set = data[ j ];

				if ( CountryData[ set.e ] === undefined ) {

					continue;

				}

				var importerName = set.i.toUpperCase();

				if ( Continent.names.indexOf( importerName ) !== -1 ) {

					addMentionedContinent( set, key );

					continue;

				}

				if ( CountryData[ set.i ] === undefined ) {

					continue;

				}

				addMentionedCountryPair( set, key );

			}


		}

		controller.mentionedCountryCodes = mentionedCache[ initDataSet ];

	}

	function addMentionedContinent( set, key ) {

		var exportCountryCode = CountryData[ set.e ].colorCode;

		if ( mentionedCache[key].indexOf( exportCountryCode ) === - 1 ) {

			mentionedCache[key].push( exportCountryCode );

		}

		var importerName = set.i.toUpperCase();

		var continentCountries = Continent[ importerName ].countries;

		for ( var i = 0; i < continentCountries.length; i++ ) {

			var tempImportCountry = continentCountries[ i ];
			var tempCountryData = CountryData[ tempImportCountry ];

			if ( tempCountryData === undefined ) {

				continue;

			}

			var tempImportCountryCode = tempCountryData.colorCode;

			if ( mentionedCache[key].indexOf( tempImportCountryCode ) === - 1 ) {

				mentionedCache[key].push( tempImportCountryCode );

			}

		}

	}

	function addMentionedCountryPair( set, key ) {

		var importCountryCode = CountryData[ set.i.toUpperCase() ].colorCode;
		var exportCountryCode = CountryData[ set.e.toUpperCase() ].colorCode;

		// add mentioned color to controller's mentionedCountryCodes ( an array to store the code )

		if ( mentionedCache[key].indexOf( importCountryCode ) === - 1 ) {

			mentionedCache[key].push( importCountryCode );

		}

		if ( mentionedCache[key].indexOf( exportCountryCode ) === - 1 ) {

			mentionedCache[key].push( exportCountryCode );

		}

	}

	function flattenData () {

		var minDataValue = 800000, maxDataValue = 5000000;

		var inputData = controller.inputData;
		var dataSetKeys = inputData.dataSetKeys;

		for ( var i = 0; i < dataSetKeys.length; i++ ) {

			var key = dataSetKeys[ i ];
			var data = inputData[key];

			Utils.flattenCountryData( data, controller.inputValueKey, minDataValue, maxDataValue );

		}

	}

	function createFakeData() {

		var inputData = controller.inputData;
		var dataSetKeys = inputData.dataSetKeys;

		for ( var i = 0; i < dataSetKeys.length; i++ ) {

			var key = dataSetKeys[ i ];
			var data = inputData[ key ];

			for ( var j in data ) {

				var set = data[ j ];
				set.fakeData = set.v;

			}

		}

		controller.inputValueKey = "fakeData";

	}

	function createGeometry () {

		var inputData = controller.inputData;
		var dataSetKeys = inputData.dataSetKeys;

		for ( var i = 0; i < dataSetKeys.length; i++ ) {

			var key = dataSetKeys[ i ];
			var data = inputData[key];

			var vec3_origin = new THREE.Vector3( 0, 0, 0 );

			if ( data === null ) {

				return;

			}

			for ( var s in data ) {

				var set = data[ s ];

				var importerName = set.i.toUpperCase();

				if ( Continent.names.indexOf( importerName ) !== -1 ) {

					makeContinentConnection( set );

					continue;

				}

				makeCountriesConnection( set, data, s );

			}

			function makeCountriesConnection( set, data, s ) {

				var exporterName = set.e.toUpperCase();
				var importerName = set.i.toUpperCase();

				if ( exporterName === "ZZ" || importerName === "ZZ" ) {

					console.group( "ZZ unknown country" );
					console.log( "ZZ country code detected for current ;countries this will not be print on the globe" );
					console.log( exporterName + ", " + importerName );
					console.groupEnd();

					delete data[ s ];

					return;

				}

				var exporter = CountryData[ exporterName ];
				var importer = CountryData[ importerName ];

				if ( exporter === null ) throw exporterName + " is not referenced as a country code! See the full list there : https://github.com/syt123450/giojs/blob/master/docs/en/Country_Code.md";
				if ( importer === null ) throw importerName + " is not referenced as a country code! See the full list there : https://github.com/syt123450/giojs/blob/master/docs/en/Country_Code.md";

				set.lineGeometry = makeConnectionLineGeometry( exporter, importer, set.fakeData );

			}

			function makeContinentConnection( dataSet ) {

				var exporterName = dataSet.e.toUpperCase();
				var importerName = dataSet.i.toUpperCase();

				var exporter = CountryData[ exporterName ];
				var importer = Continent[ importerName ];

				dataSet.lineGeometry = makeConnectionLineGeometry( exporter, importer, dataSet.fakeData );

			}

			function makeConnectionLineGeometry ( exporter, importer, value ) {

				var exporterCenter = exporter.center.clone();
				var distanceBetweenCountryCenter = exporterCenter.subVectors( exporterCenter, importer.center ).length();

				var start = exporter.center;
				var end = importer.center;

				var mid = start.clone().lerp( end, 0.5 );
				var midLength = mid.length();
				mid.normalize();
				mid.multiplyScalar( midLength + distanceBetweenCountryCenter * 0.7 );

				var normal = ( new THREE.Vector3() ).subVectors( start, end );
				normal.normalize();

				var distanceHalf = distanceBetweenCountryCenter * 0.5;

				var startAnchor = start;

				var midStartAnchor = mid.clone().add( normal.clone().multiplyScalar( distanceHalf ) );
				var midEndAnchor = mid.clone().add( normal.clone().multiplyScalar( -distanceHalf ) );

				var endAnchor = end;

				var splineCurveA = new THREE.CubicBezierCurve3( start, startAnchor, midStartAnchor, mid );
				var splineCurveB = new THREE.CubicBezierCurve3( mid, midEndAnchor, endAnchor, end );

				var vertexCountDesired = Math.floor( distanceBetweenCountryCenter * 0.02 + 6 ) * 2;

				var points = splineCurveA.getPoints( vertexCountDesired );

				points = points.splice( 0, points.length - 1 );
				points = points.concat( splineCurveB.getPoints( vertexCountDesired ) );
				points.push( vec3_origin );

				var val = value * 0.0003;

				var size = ( 10 + Math.sqrt( val ) );


				size = Utils.constrain( size, 0.1, 60 );

				var curveGeometry = new THREE.Geometry();

				for ( var i = 0; i < points.length; i++ ) {

					curveGeometry.vertices.push( points[ i ] );

				}

				curveGeometry.size = size;

				return curveGeometry;

			}

		}


	}

	function dumpData () {

		var initDataSet = controller.inputData.initDataSet;
		controller.globalData = controller.inputData[ initDataSet ];

	}

	function switchDataSet ( dataSetName ) {

		var dataSetKeys = controller.inputData.dataSetKeys;

		if ( dataSetKeys.indexOf( dataSetName ) !== - 1 ) {

			controller.mentionedCountryCodes = mentionedCache[ dataSetName ];
			controller.globalData = controller.inputData[ dataSetName ];
			controller.visSystemHandler.update();
			controller.surfaceHandler.update();

		}

	}

	return {

		createMentionedCountries: createMentionedCountries,

		flattenData: flattenData,

		createFakeData: createFakeData,

		createGeometry: createGeometry,

		dumpData: dumpData,

		switchDataSet: switchDataSet

	}

}

function SingleDataHandler(controller) {

	function createMentionedCountries() {

		var inputData = controller.inputData;

		for ( var i in inputData ) {

			var dataSet = inputData[ i ];

			if (CountryData[ dataSet.e ] === undefined) {
				continue;
			}

			var importerName = dataSet.i.toUpperCase();

			if ( Continent.names.indexOf( importerName ) !== -1 ) {

				addMentionedContinent( dataSet );

				continue;

			}

			if (CountryData[ dataSet.i ] === undefined) {
				continue;
			}

			addMentionedCountryPair( dataSet );

		}


	}

	function addMentionedContinent( dataSet ) {

		var exportCountryCode = CountryData[ dataSet.e ].colorCode;

		if ( controller.mentionedCountryCodes.indexOf( exportCountryCode ) === - 1 ) {

			controller.mentionedCountryCodes.push( exportCountryCode );

		}

		var importerName = dataSet.i.toUpperCase();

		var continentCountries = Continent[ importerName ].countries;

		for ( var i = 0; i < continentCountries.length; i++ ) {

			var tempImportCountry = continentCountries[ i ];
			var tempCountryData = CountryData[ tempImportCountry ];

			if ( tempCountryData === undefined ) {

				continue;

			}

			var tempImportCountryCode = tempCountryData.colorCode;

			if ( controller.mentionedCountryCodes.indexOf( tempImportCountryCode ) === - 1 ) {

				controller.mentionedCountryCodes.push( tempImportCountryCode );

			}

		}

	}

	function addMentionedCountryPair(dataSet) {

		var importCountryCode = CountryData[ dataSet.i ].colorCode;
		var exportCountryCode = CountryData[ dataSet.e ].colorCode;

		// add mentioned color to controller's mentionedCountryCodes ( an array to store the code )

		if ( controller.mentionedCountryCodes.indexOf( importCountryCode ) === - 1 ) {

			controller.mentionedCountryCodes.push( importCountryCode );

		}

		if ( controller.mentionedCountryCodes.indexOf( exportCountryCode ) === - 1 ) {

			controller.mentionedCountryCodes.push( exportCountryCode );

		}

	}

	function flattenData() {

		var minDataValue = 800000, maxDataValue = 5000000;

		var inputData = controller.inputData;

		Utils.flattenCountryData(inputData, controller.inputValueKey, minDataValue, maxDataValue);

	}

	function createFakeData() {

		var inputData = controller.inputData;

		for ( var i in inputData ) {

			var set = inputData[ i ];
			set.fakeData = set.v;

		}

		// update input value key

		controller.inputValueKey = "fakeData";

	}

	function createGeometry() {

		var vec3_origin = new THREE.Vector3( 0, 0, 0 );

		if ( controller.inputData === null ) {

			return;

		}

		for ( var s in controller.inputData ) {

			var set = controller.inputData[ s ];

			var importerName = set.i.toUpperCase();

			if ( Continent.names.indexOf( importerName ) !== -1 ) {

				makeContinentConnection( set );

				continue;

			}

			makeCountriesConnection( set );

		}

		function makeCountriesConnection( dataSet ) {

			var exporterName = dataSet.e.toUpperCase();
			var importerName = dataSet.i.toUpperCase();

			if ( exporterName === "ZZ" || importerName === "ZZ" ) {

				console.group( "ZZ unknown country" );
				console.log( "ZZ country code detected for current ;countries this will not be print on the globe" );
				console.log( exporterName + ", " + importerName );
				console.groupEnd();

				delete controller.inputData[ s ];

				return;

			}

			var exporter = CountryData[ exporterName ];
			var importer = CountryData[ importerName ];

			if ( exporter === null ) throw exporterName + " is not referenced as a country code! See the full list there : https://github.com/syt123450/giojs/blob/master/docs/en/Country_Code.md";
			if ( importer === null ) throw importerName + " is not referenced as a country code! See the full list there : https://github.com/syt123450/giojs/blob/master/docs/en/Country_Code.md";

			dataSet.lineGeometry = makeConnectionLineGeometry( exporter, importer, dataSet.fakeData );

		}

		function makeContinentConnection( dataSet ) {

			var exporterName = dataSet.e.toUpperCase();
			var importerName = dataSet.i.toUpperCase();

			var exporter = CountryData[ exporterName ];
			var importer = Continent[ importerName ];

			dataSet.lineGeometry = makeConnectionLineGeometry( exporter, importer, dataSet.fakeData );

		}

		function makeConnectionLineGeometry ( exporter, importer, value ) {

			var exporterCenter = exporter.center.clone();
			var distanceBetweenCountryCenter = exporterCenter.subVectors( exporterCenter, importer.center ).length();

			var start = exporter.center;
			var end = importer.center;

			var mid = start.clone().lerp( end, 0.5 );
			var midLength = mid.length();
			mid.normalize();
			mid.multiplyScalar( midLength + distanceBetweenCountryCenter * 0.7 );

			var normal = ( new THREE.Vector3() ).subVectors( start, end );
			normal.normalize();

			var distanceHalf = distanceBetweenCountryCenter * 0.5;

			var startAnchor = start;

			var midStartAnchor = mid.clone().add( normal.clone().multiplyScalar( distanceHalf ) );
			var midEndAnchor = mid.clone().add( normal.clone().multiplyScalar( -distanceHalf ) );

			var endAnchor = end;

			var splineCurveA = new THREE.CubicBezierCurve3( start, startAnchor, midStartAnchor, mid );
			var splineCurveB = new THREE.CubicBezierCurve3( mid, midEndAnchor, endAnchor, end );

			var vertexCountDesired = Math.floor( distanceBetweenCountryCenter * 0.02 + 6 ) * 2;

			var points = splineCurveA.getPoints( vertexCountDesired );

			points = points.splice( 0, points.length - 1 );
			points = points.concat( splineCurveB.getPoints( vertexCountDesired ) );
			points.push( vec3_origin );

			var val = value * 0.0003;

			var size = ( 10 + Math.sqrt( val ) );


			size = Utils.constrain( size, 0.1, 60 );

			var curveGeometry = new THREE.Geometry();

			for ( var i = 0; i < points.length; i++ ) {

				curveGeometry.vertices.push( points[ i ] );

			}

			curveGeometry.size = size;

			return curveGeometry;

		}

	}

	function dumpData() {
		controller.globalData = controller.inputData;
	}

	return {

		createMentionedCountries: createMentionedCountries,

		flattenData: flattenData,

		createFakeData: createFakeData,

		createGeometry: createGeometry,

		dumpData: dumpData

	}

}

/**
 * @author syt123450 / https://github.com/syt123450
 */

/**
 * This is the controller object when IO Globe is running,
 * When developer want to create a new IO globe, they first need to create a controller instance and then init this controller.
 * How to create and use this controller is introduce in API document and shown in demos.
 */

function Controller ( container, configureObject ) {

    // constructor parameters

    this.container = container;
    this.constructorConfigure = configureObject;

    // configure object

    this.configure = new Configure();

    // handlers used to handle tasks in controller

    this.dataGroupHandler = new DataGroupHandler( this );
    this.singleDataHandler = new SingleDataHandler( this );
    this.configureHandler = new ConfigureHandler( this );
    this.rotationHandler = new RotationHandler( this );
    this.surfaceHandler = new SurfaceHandler( this );
    this.wheelHandler = new WheelHandler( this );
    this.visSystemHandler = new VisSystemHandler( this );
    this.switchCountryHandler = new SwitchCountryHandler( this );
    this.resizeHandler = new ResizeHandler( this );
    this.initHandler = new InitHandler( this );
    this.dataHandler = new DataHandler( this );
    this.haloHandler = new HaloHandler( this );
    
    // define a data processor to pre-processor the data, will be initialized in InitHandler

    this.dataProcessor = null;

    // configure "configure object" through constructor configure

    this.configureHandler.configureConstructor();

    // important components, they will be initialized when initHandler is called

    this.visualizationMesh = null;
    this.renderer = null;
    this.camera = null;
    this.lights = null;

    this.scene = null;
    this.rotating = null;
    this.sphere = null;
    this.earthSurfaceShader = null;
    this.halo = null;
    this.haloShader = null;

	this.inputData = [];
	this.globalData = [];

    this.dataGroup = false;
    // this.inputValueKey = "v";

    this.mentionedCountryCodes = [];
    this.relatedCountries = [];

    this.selectedCountry = null;

    this.stats = null;

    this.initialized = false;

    // hold controller itself

    var controller = this;

    // API is defined in return object

    return {

        init: function () {

            controller.initHandler.init();

            return this;

        },

        addData: function ( data ) {

            controller.dataHandler.loadJSON( data );

            if ( controller.initialized === true ) {

                controller.dataProcessor.process( controller );
                controller.visSystemHandler.update();
                controller.surfaceHandler.update();

            }

            return this;

        },

        clearData: function () {

            controller.inputData = [];
            controller.globalData = [];

            if ( controller.initialized === true ) {

                controller.visSystemHandler.update();
                controller.surfaceHandler.update();

            }

            return this;

        },

        addDataAsync: function ( url, callback ) {

            controller.dataHandler.loadAsync( url, callback );

            return this;

        },

        addLiveData: function ( url, callback, milliseconds ) {

            controller.dataHandler.liveLoad( url, callback, milliseconds );

            return this;

        },

        setSurfaceColor: function ( color ) {

            controller.configure.color.surface = color;

            if ( controller.initialized === true ) {

                controller.surfaceHandler.update();

            }

            return this;

        },

        setSelectedColor: function ( color ) {

            controller.configure.color.selected = color;

            if ( controller.initialized === true ) {

                controller.surfaceHandler.update();

            }

            return this;

        },

        getScene: function () {

            return controller.scene;

        },

        setInitCountry: function ( ISOAbbr ) {

            controller.configure.control.initCountry = ISOAbbr;

            return this;

        },

        disableUnmentioned: function ( flag ) {

            controller.configure.control.disableUnmentioned = flag;

            return this;

        },

        lightenMentioned: function ( flag ) {

            controller.configure.control.lightenMentioned = flag;

            if ( controller.initialized === true ) {

                controller.surfaceHandler.update();

            }

            return this;

        },

        setExportColor: function ( color ) {

            controller.configure.color.out = color;

            if ( controller.initialized === true ) {

                controller.visSystemHandler.update();

            }

            return this;

        },

        setImportColor: function ( color ) {

            controller.configure.color.in = color;

            if ( controller.initialized === true ) {

                controller.visSystemHandler.update();

            }

            return this;

        },

        getSelectedCountry: function () {

            return controller.selectedCountry;

        },

        getRelatedCountries: function () {

            return controller.relatedCountries;

        },

        onCountryPicked: function ( callBack ) {

            controller.switchCountryHandler.setCountryPickCallBack( callBack );

        },

        enableStats: function () {

            if ( controller.configure.control.stats === false && controller.initialized ) {

                if ( controller.stats === null ) {

                    controller.stats = ObjectUtils.createStats(controller.container);

                }

                controller.container.appendChild( controller.stats.dom );

            }

            controller.configure.control.stats = true;

            return this;

        },

        disableStats: function () {

            if ( controller.configure.control.stats === true && controller.stats !== null ) {

                controller.container.removeChild( controller.stats.dom );

            }

            controller.configure.control.stats = false;

            return this;

        },

        getStatsObject: function () {

            return controller.stats;

        },

        getConfig: function () {

            return controller.configure;
        },

        adjustRelatedBrightness: function ( brightness ) {

            controller.configure.brightness.related = brightness;

            if ( controller.initialized === true ) {

                controller.surfaceHandler.update();

            }

            return this;

        },

        adjustOceanBrightness: function ( brightness ) {

            controller.configure.brightness.ocean = brightness;

            if ( controller.initialized === true ) {

                controller.surfaceHandler.update();

            }

            return this;

        },

        adjustMentionedBrightness: function ( brightness ) {

            controller.configure.brightness.mentioned = brightness;

            if ( controller.initialized === true ) {

                controller.surfaceHandler.update();

            }

            return this;

        },

        setStyle: function ( style ) {

            controller.configureHandler.configureStyle( style );

            return this;

        },

        configure: function ( configure ) {

            controller.configureHandler.configureJSON( configure );

            if ( controller.initialized === true ) {

                controller.surfaceHandler.update();
                controller.visSystemHandler.update();

            }

            return this;

        },

        switchCountry: function ( ISOAbbr, direction ) {

            controller.switchCountryHandler.switchFromAPI( ISOAbbr, direction );

            return this;

        },

        showInOnly: function ( flag ) {

            if ( flag === true ) {

                controller.configure.control.inOnly = true;
                controller.configure.control.outOnly = false;

            } else {

                controller.configure.control.inOnly = false;
            }

            if ( controller.initialized === true ) {

                controller.visSystemHandler.update();

            }

            return this;

        },

        showOutOnly: function ( flag ) {

            if ( flag === true ) {

                controller.configure.control.outOnly = true;
                controller.configure.control.inOnly = false;

            } else {

                controller.configure.control.outOnly = false;

            }

            if ( controller.initialized === true ) {

                controller.visSystemHandler.update();

            }

            return this;

        },

        closeLiveLoader: function () {

            controller.dataHandler.stopLiveLoader();

            return this;

        },

        // to be used to force update the whole system after init(), may not be used by user

        update: function () {

            if ( controller.initialized === true ) {

                controller.dataProcessor.process( controller );
                controller.visSystemHandler.update();
                controller.surfaceHandler.update();

            }

            return this;

        },

        setHaloColor: function ( color ) {

            controller.configure.color.halo = color;

            if ( controller.initialized === true ) {

                controller.haloHandler.update();

            }

            return this;

        },

        removeHalo: function () {

            controller.configure.control.halo = false;


            if ( controller.initialized === true ) {

                controller.haloHandler.remove();

            }

            return this;

        },

        addHalo: function ( color ) {

            controller.configure.control.halo = true;

            if ( color !== undefined ) {

                controller.configure.color.halo = color;

            }

            if ( controller.initialized === true ) {

                if ( controller.halo !== null ) {

                    controller.haloHandler.update();

                } else {

                    controller.haloHandler.create();

                }

            }

            return this;

        },

        setBackgroundColor: function ( color ) {

            controller.configure.color.background = color;

            if ( controller.initialized === true ) {

                controller.scene.background = new THREE.Color( color );

            }

            return this;

        },

        resizeUpdate: function () {

            controller.resizeHandler.resizeScene();

            return this;

        },

        switchDataSet: function ( dataSetName ) {

            if ( controller.dataGroup ) {

                controller.dataGroupHandler.switchDataSet( dataSetName );

            }

            return this;

        },
        
        setTransparentBackground: function( isTransparent ) {
	
	        controller.configure.control.transparentBackground = isTransparent;
	        
	        return this;
         
        }

    }

}

exports.Controller = Controller;

Object.defineProperty(exports, '__esModule', { value: true });

})));
