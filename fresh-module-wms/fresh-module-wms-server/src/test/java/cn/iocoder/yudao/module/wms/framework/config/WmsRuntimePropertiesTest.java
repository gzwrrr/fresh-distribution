package cn.iocoder.yudao.module.wms.framework.config;

import org.junit.jupiter.api.Test;
import org.springframework.boot.autoconfigure.AutoConfigurations;
import org.springframework.boot.test.context.runner.ApplicationContextRunner;
import org.springframework.cloud.autoconfigure.RefreshAutoConfiguration;
import org.springframework.context.annotation.Configuration;

import java.util.Arrays;

import static org.assertj.core.api.Assertions.assertThat;

class WmsRuntimePropertiesTest {

    private final ApplicationContextRunner contextRunner = new ApplicationContextRunner()
            .withConfiguration(AutoConfigurations.of(RefreshAutoConfiguration.class))
            .withUserConfiguration(TestConfiguration.class)
            .withPropertyValues(
                    "fresh.wms.runtime.near-expiry-alarm-days=5",
                    "fresh.wms.runtime.low-stock-alert-percent=18",
                    "fresh.wms.runtime.auto-allocate-shipment=false",
                    "fresh.wms.runtime.dispatch-wave-label=晚市优先波次",
                    "fresh.wms.runtime.cold-chain-warehouse-codes[0]=WH-COLD-SH",
                    "fresh.wms.runtime.cold-chain-warehouse-codes[1]=WH-COLD-HZ"
            );

    @Test
    void shouldBindConfiguredValues() {
        contextRunner.run(context -> {
            WmsRuntimeProperties properties = context.getBean(WmsRuntimeProperties.class);
            assertThat(properties.getNearExpiryAlarmDays()).isEqualTo(5);
            assertThat(properties.getLowStockAlertPercent()).isEqualTo(18);
            assertThat(properties.getAutoAllocateShipment()).isFalse();
            assertThat(properties.getDispatchWaveLabel()).isEqualTo("晚市优先波次");
            assertThat(properties.getColdChainWarehouseCodes())
                    .isEqualTo(Arrays.asList("WH-COLD-SH", "WH-COLD-HZ"));
        });
    }

    @Configuration(proxyBeanMethods = false)
    static class TestConfiguration extends WmsRuntimeConfiguration {
    }

}
