package cn.iocoder.yudao.module.infra.job.demo;

import cn.iocoder.yudao.framework.quartz.core.handler.JobHandler;
import cn.iocoder.yudao.framework.tenant.core.aop.TenantIgnore;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

/**
 * infra 本地演示任务，便于快速验证 Quartz 调度链路。
 */
@Component("demoJob")
@Slf4j
public class DemoJob implements JobHandler {

    @Override
    @TenantIgnore
    public String execute(String param) {
        String message = "fresh infra demo job executed";
        log.info("[execute][{} param={}]", message, param);
        return message;
    }
}
