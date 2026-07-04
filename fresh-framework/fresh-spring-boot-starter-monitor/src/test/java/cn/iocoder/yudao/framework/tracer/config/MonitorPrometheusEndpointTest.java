package cn.iocoder.yudao.framework.tracer.config;

import org.junit.jupiter.api.Test;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

import static org.assertj.core.api.Assertions.assertThat;

class MonitorPrometheusEndpointTest {

    @Test
    void shouldExposePrometheusEndpoint() {
        try (ConfigurableApplicationContext context = new SpringApplicationBuilder(TestApplication.class)
                .properties(
                        "server.port=0",
                        "spring.application.name=monitor-test-app",
                        "management.endpoints.web.exposure.include=health,info,prometheus",
                        "management.metrics.export.prometheus.enabled=true",
                        "yudao.tracer.enable=false")
                .run()) {
            Integer port = context.getEnvironment().getProperty("local.server.port", Integer.class);
            ResponseEntity<String> response = new RestTemplate().getForEntity(
                    "http://127.0.0.1:" + port + "/actuator/prometheus", String.class);

            assertThat(response.getStatusCodeValue()).isEqualTo(200);
            assertThat(response.getBody()).contains("jvm_memory_used_bytes");
        }
    }

    @SpringBootApplication
    static class TestApplication {
    }

}
