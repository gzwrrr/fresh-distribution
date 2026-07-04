package cn.iocoder.yudao.module.wms.framework.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.cloud.context.config.annotation.RefreshScope;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration(proxyBeanMethods = false)
public class WmsRuntimeConfiguration {

    @Bean
    @RefreshScope
    @ConfigurationProperties(prefix = "fresh.wms.runtime")
    public WmsRuntimeProperties wmsRuntimeProperties() {
        return new WmsRuntimeProperties();
    }

}
