package com.gymmanagement.system;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.List;

@SpringBootApplication
public class GymManagementSystemApplication {

    public static void main(String[] args) {
        Dotenv dotenv = Dotenv.configure()
                .ignoreIfMalformed()
                .ignoreIfMissing()
                .load();

        dotenv.entries().forEach(entry -> {
            if (System.getenv(entry.getKey()) == null && System.getProperty(entry.getKey()) == null) {
                System.setProperty(entry.getKey(), entry.getValue());
            }
        });

        configureRailwayMysqlFallback();

        SpringApplication.run(GymManagementSystemApplication.class, args);
    }

    private static void configureRailwayMysqlFallback() {
        if (getConfig("DB_URL") == null) {
            String railwayMysqlUrl = getConfig("MYSQL_URL");
            if (railwayMysqlUrl != null && !railwayMysqlUrl.isBlank()) {
                applyRailwayMysqlUrl(railwayMysqlUrl);
            } else if (hasRailwayMysqlParts()) {
                applyRailwayMysqlParts();
            }
        }
    }

    private static void applyRailwayMysqlUrl(String railwayMysqlUrl) {
        try {
            URI uri = new URI(railwayMysqlUrl);
            String host = uri.getHost();
            int port = uri.getPort() == -1 ? 3306 : uri.getPort();
            String database = uri.getPath() == null ? "" : uri.getPath().replaceFirst("^/", "");

            if (host == null || database.isBlank()) {
                return;
            }

            String username = null;
            String password = null;
            if (uri.getUserInfo() != null) {
                String[] credentials = uri.getUserInfo().split(":", 2);
                username = credentials.length > 0 ? credentials[0] : null;
                password = credentials.length > 1 ? credentials[1] : null;
            }

            setIfMissing("DB_URL", buildJdbcUrl(host, port, database, uri.getQuery()));
            setIfMissing("DB_USERNAME", username);
            setIfMissing("DB_PASSWORD", password);
        } catch (URISyntaxException ignored) {
            // Keep startup resilient if MYSQL_URL is present but malformed.
        }
    }

    private static void applyRailwayMysqlParts() {
        String host = getConfig("MYSQLHOST");
        String portValue = getConfig("MYSQLPORT");
        String database = getConfig("MYSQLDATABASE");
        String username = getConfig("MYSQLUSER");
        String password = getConfig("MYSQLPASSWORD");

        if (host == null || database == null) {
            return;
        }

        int port = 3306;
        if (portValue != null) {
            try {
                port = Integer.parseInt(portValue);
            } catch (NumberFormatException ignored) {
                port = 3306;
            }
        }

        setIfMissing("DB_URL", buildJdbcUrl(host, port, database, null));
        setIfMissing("DB_USERNAME", username);
        setIfMissing("DB_PASSWORD", password);
    }

    private static boolean hasRailwayMysqlParts() {
        return getConfig("MYSQLHOST") != null
                && getConfig("MYSQLPORT") != null
                && getConfig("MYSQLDATABASE") != null;
    }

    private static String buildJdbcUrl(String host, int port, String database, String query) {
        List<String> params = new ArrayList<>();
        if (query != null && !query.isBlank()) {
            params.add(query);
        }

        addParamIfMissing(params, "createDatabaseIfNotExist=true", "createDatabaseIfNotExist=");
        addParamIfMissing(params, "useSSL=false", "useSSL=");
        addParamIfMissing(params, "allowPublicKeyRetrieval=true", "allowPublicKeyRetrieval=");
        addParamIfMissing(params, "serverTimezone=UTC", "serverTimezone=");

        return "jdbc:mysql://" + host + ":" + port + "/" + database + "?" + String.join("&", params);
    }

    private static void addParamIfMissing(List<String> params, String value, String keyPrefix) {
        boolean exists = params.stream().anyMatch(param -> param.startsWith(keyPrefix));
        if (!exists) {
            params.add(value);
        }
    }

    private static String getConfig(String key) {
        String systemProperty = System.getProperty(key);
        if (systemProperty != null && !systemProperty.isBlank()) {
            return systemProperty;
        }

        String environmentValue = System.getenv(key);
        if (environmentValue != null && !environmentValue.isBlank()) {
            return environmentValue;
        }

        return null;
    }

    private static void setIfMissing(String key, String value) {
        if (value == null || value.isBlank()) {
            return;
        }

        if (getConfig(key) == null) {
            System.setProperty(key, value);
        }
    }
}
