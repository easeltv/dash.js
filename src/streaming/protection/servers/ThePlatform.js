
/**
 * Modified CastLabs DRMToday License Server implementation
 *
 * @implements LicenseServer
 * @class
 */

//import ProtectionConstants from '../../constants/ProtectionConstants';

function ThePlatform(config) {

    function log(...args) { args.unshift('ThePlatform'); console.log.apply(console, args); }

    log('ThePlatform', config);

    config = config || {};
    const BASE64 = config.BASE64;
    const tpData = config.tpData || {};

    let instance;

    function checkConfig() {
        log('checkConfig');
        if (!BASE64 || !BASE64.hasOwnProperty('decodeArray')) {
            throw new Error('Missing config parameter(s)');
        }
    }

    function getServerURLFromMessage(url /*, message, messageType*/) {
        console.log('getServerURLFromMessage', url);
        // return url + '/wv/web/ModularDrm/getWidevineLicense?form=json&schema=1.0'
        //     + '&_releasePid=' + config.releasePid
        url = 'https://widevine.entitlement.theplatform.eu';
        return url + '/wv/web/ModularDrm?form=json&schema=1.0' +
            '&account=' + encodeURIComponent(tpData.accountId) +
            '&token=' + encodeURIComponent(tpData.token);
        // return url;
    }

    function getHTTPMethod(/*messageType*/) {
        return 'POST';
    }

    function getResponseType(keySystemStr/*, messageType*/) {
        log('getResponseType', keySystemStr);
        return 'json';
    }

    function getLicenseMessage(serverResponse, keySystemStr/*, messageType*/) {
        log('getLicenseMessage', serverResponse, keySystemStr);
        checkConfig();
        var licenceValue = serverResponse.getWidevineLicenseResponse.license;
        log('Widevine getLicenseMessage::licence value is::' + licenceValue);
        var formattedResponse = _base64ToArrayBuffer(licenceValue);
        return formattedResponse;
    }

    function getErrorResponse(serverResponse, keySystemStr/*, messageType*/) {
        log('getErrorResponse', serverResponse, keySystemStr);
        return serverResponse;
    }

    function _base64ToArrayBuffer(base64) {
        var binary_string =  window.atob(base64);
        var len = binary_string.length;
        var bytes = new Uint8Array( len );
        for (var i = 0; i < len; i++)        {
            bytes[i] = binary_string.charCodeAt(i);
        }
        return bytes.buffer;
    }

    instance = {
        getServerURLFromMessage: getServerURLFromMessage,
        getHTTPMethod: getHTTPMethod,
        getResponseType: getResponseType,
        getLicenseMessage: getLicenseMessage,
        getErrorResponse: getErrorResponse
    };

    return instance;
}

ThePlatform.__dashjs_factory_name = 'ThePlatform';
export default dashjs.FactoryMaker.getSingletonFactory(ThePlatform); /* jshint ignore:line */