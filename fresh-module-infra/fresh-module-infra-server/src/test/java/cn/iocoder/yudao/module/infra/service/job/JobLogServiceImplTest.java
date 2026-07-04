package cn.iocoder.yudao.module.infra.service.job;

import cn.iocoder.yudao.framework.test.core.ut.BaseDbUnitTest;
import cn.iocoder.yudao.module.infra.dal.dataobject.job.JobLogDO;
import cn.iocoder.yudao.module.infra.dal.mysql.job.JobLogMapper;
import cn.iocoder.yudao.module.infra.enums.job.JobLogStatusEnum;
import org.junit.jupiter.api.Test;
import org.springframework.context.annotation.Import;

import javax.annotation.Resource;
import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

@Import(JobLogServiceImpl.class)
class JobLogServiceImplTest extends BaseDbUnitTest {

    @Resource
    private JobLogService jobLogService;

    @Resource
    private JobLogMapper jobLogMapper;

    @Test
    void testCreateAndUpdateJobLog_success() {
        LocalDateTime beginTime = LocalDateTime.now().minusSeconds(3);

        Long logId = jobLogService.createJobLog(11L, beginTime, "demoJob", "fresh", 1);
        jobLogService.updateJobLogResultAsync(logId, LocalDateTime.now(), 3000, true, "ok");

        JobLogDO log = jobLogMapper.selectById(logId);
        assertNotNull(log);
        assertEquals(JobLogStatusEnum.SUCCESS.getStatus(), log.getStatus());
        assertEquals("ok", log.getResult());
        assertEquals("demoJob", log.getHandlerName());
    }
}
