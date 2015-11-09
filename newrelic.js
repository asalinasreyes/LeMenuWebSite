/**
 * New Relic agent configuration.
 *
 * See lib/config.defaults.js in the agent distribution for a more complete
 * description of configuration variables and their potential values.
 */
exports.config = {
  /**
   * Array of application names.
   */
  app_name: ['TestLoad LeMenu'],
  /**
   * Your New Relic license key.
   */
  license_key: 'f6c90b2aa69b92cbc53f17f64e1a4d67a85191a4',
  logging: {
    /**
     * Level at which to log. 'trace' is most useful to New Relic when diagnosing
     * issues with the agent, 'info' and higher will impose the least overhead on
     * production applications.
     */
    level: 'info',
    enabled:false
  }
}
