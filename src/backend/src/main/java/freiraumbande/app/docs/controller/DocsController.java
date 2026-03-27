package freiraumbande.app.docs.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class DocsController {

    @GetMapping("/api/docs")
    public String redirect() {
        return "redirect:/swagger-ui/index.html";
    }
}
