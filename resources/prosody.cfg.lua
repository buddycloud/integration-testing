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
                "bosh";
};

allow_registration = true;
daemonize = true;
consider_websocket_secure = true;
consider_bosh_secure = true;
pidfile = "/var/run/prosody/prosody.pid";

c2s_require_encryption = false

authentication = "internal_plain"

log = {
	-- Log files (change 'info' to 'debug' for debug logs):
	info = "/var/log/prosody/prosody.log";
	error = "/var/log/prosody/prosody.err";
	-- Syslog:
	{ levels = { "error" }; to = "syslog";  };
}

VirtualHost "enterprise.sf"
	enabled = true
    ssl = {
		key = "/etc/prosody/certs/example.com.key";
		certificate = "/etc/prosody/certs/example.com.crt";
	}

Component "channels.enterprise.sf"
	component_secret = "mysecretcomponentpassword"

VirtualHost "voyager.sf"
	enabled = true
    ssl = {
		key = "/etc/prosody/certs/example.com.key";
		certificate = "/etc/prosody/certs/example.com.crt";
	}

Component "channels.voyager.sf"
	component_secret = "mysecretcomponentpassword"

VirtualHost "borg.collective"
	enabled = true
    ssl = {
		key = "/etc/prosody/certs/example.com.key";
		certificate = "/etc/prosody/certs/example.com.crt";
	}

Component "hive.borg.collective"
	component_secret = "mysecretcomponentpassword"