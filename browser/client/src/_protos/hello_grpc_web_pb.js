/**
 * @fileoverview gRPC-Web generated client stub for 
 * @enhanceable
 * @public
 */

// GENERATED CODE -- DO NOT EDIT!


/* eslint-disable */
// @ts-nocheck



const grpc = {};
grpc.web = require('grpc-web');

const proto = require('./hello_pb.js');

/**
 * @param {string} hostname
 * @param {?Object} credentials
 * @param {?Object} options
 * @constructor
 * @struct
 * @final
 */
proto.GreeterClient =
    function(hostname, credentials, options) {
  if (!options) options = {};
  options['format'] = 'text';

  /**
   * @private @const {!grpc.web.GrpcWebClientBase} The client
   */
  this.client_ = new grpc.web.GrpcWebClientBase(options);

  /**
   * @private @const {string} The hostname
   */
  this.hostname_ = hostname;

};


/**
 * @param {string} hostname
 * @param {?Object} credentials
 * @param {?Object} options
 * @constructor
 * @struct
 * @final
 */
proto.GreeterPromiseClient =
    function(hostname, credentials, options) {
  if (!options) options = {};
  options['format'] = 'text';

  /**
   * @private @const {!grpc.web.GrpcWebClientBase} The client
   */
  this.client_ = new grpc.web.GrpcWebClientBase(options);

  /**
   * @private @const {string} The hostname
   */
  this.hostname_ = hostname;

};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.Req,
 *   !proto.Res>}
 */
const methodDescriptor_Greeter_say_hello = new grpc.web.MethodDescriptor(
  '/Greeter/say_hello',
  grpc.web.MethodType.UNARY,
  proto.Req,
  proto.Res,
  /**
   * @param {!proto.Req} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.Res.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.Req,
 *   !proto.Res>}
 */
const methodInfo_Greeter_say_hello = new grpc.web.AbstractClientBase.MethodInfo(
  proto.Res,
  /**
   * @param {!proto.Req} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.Res.deserializeBinary
);


/**
 * @param {!proto.Req} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.Res)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.Res>|undefined}
 *     The XHR Node Readable Stream
 */
proto.GreeterClient.prototype.say_hello =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/Greeter/say_hello',
      request,
      metadata || {},
      methodDescriptor_Greeter_say_hello,
      callback);
};


/**
 * @param {!proto.Req} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.Res>}
 *     Promise that resolves to the response
 */
proto.GreeterPromiseClient.prototype.say_hello =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/Greeter/say_hello',
      request,
      metadata || {},
      methodDescriptor_Greeter_say_hello);
};


module.exports = proto;

