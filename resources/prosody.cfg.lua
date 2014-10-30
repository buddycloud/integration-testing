modules_enabled = {
		"roster";
		"saslauth";
		"tls";
		"dialback";
		"disco";
		"private"; 
		"vcard";
		"version";
		"uptime";
		"time";
		"ping";
		"pep";
		"register";
		"admin_adhoc"; 
		"posix";
};

allow_registration = true;
daemonize = true;
consider_websocket_secure = true;
consider_bosh_secure = true;
pidfile = "/var/run/prosody/prosody.pid";

c2s_require_encryption = false

interfaces = { "0.0.0.0" };
component_interface = "0.0.0.0";

authentication = "internal_plain"

log = {
	-- Log files (change 'info' to 'debug' for debug logs):
	info = "/var/log/prosody/prosody.log";
	error = "/var/log/prosody/prosody.err";
	-- Syslog:
	{ levels = { "error" }; to = "syslog";  };
}

ssl = {
    key = "/etc/prosody/certs/localhost.key";
    certificate = "/etc/prosody/certs/localhost.cert";
}

VirtualHost "enterprise.sf"
	enabled = true

Component "channels.enterprise.sf"
	component_secret = "mysecretcomponentpassword"

Component "topics.enterprise.sf"
	component_secret = "mysecretcomponentpassword"

VirtualHost "voyager.sf"
	enabled = true

Component "channels.voyager.sf"
	component_secret = "mysecretcomponentpassword"

VirtualHost "borg.collective"
	enabled = true

Component "hive.borg.collective"
	component_secret = "mysecretcomponentpassword"