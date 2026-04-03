module.exports = {
  apps: [
    {
      name: 'payload-cms', // Nombre para identificar la app
      script: 'dist/server.js', // Script de servidor que genera 'build'
      instances: 2, // 2 vCores disponibles
      exec_mode: 'cluster', // Modo clúster para balanceo y reinicios sin downtime
      watch: false, // No vigilar cambios en archivos (corriendo en producción)
      
      // Variables de entorno
      env: {
        NODE_ENV: 'production',
        PAYLOAD_CONFIG_PATH: 'dist/payload/payload.config.js',
      },
      
      // Gestión de logs
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      out_file: '/root/.pm2/logs/payload-cms-out.log', // Log estándar
      error_file: '/root/.pm2/logs/payload-cms-error.log', // Log de errores
      merge_logs: true,
    },
  ],
};
