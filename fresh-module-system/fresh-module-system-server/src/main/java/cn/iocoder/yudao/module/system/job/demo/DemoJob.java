package cn.iocoder.yudao.module.system.job.demo;

import cn.iocoder.yudao.framework.quartz.core.handler.JobHandler;
import cn.iocoder.yudao.framework.tenant.core.job.TenantJob;
import com.xxl.job.core.handler.annotation.XxlJob;
import org.springframework.stereotype.Component;

@Component
public class DemoJob implements JobHandler {

    @XxlJob("demoJob")
    @TenantJob
    public void execute() {
        execute(null);
    }

    @Override
    @TenantJob
    public String execute(String param) {
        System.out.println("美滋滋");
        return "美滋滋";
    }

}
